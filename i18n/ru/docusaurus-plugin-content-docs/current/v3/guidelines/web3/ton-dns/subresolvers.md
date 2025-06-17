import Feedback from '@site/src/components/Feedback';

# Резолверы TON DNS

## Введение

TON DNS — это мощный инструмент. Он позволяет не только назначать домены для TON сайтов/хранилищ, но и настраивать разрешение поддоменов.

## Полезные ссылки

1. [Система адресации смарт-контрактов TON](/v3/documentation/smart-contracts/addresses)
2. [TEP-0081 – Стандарт TON DNS](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md)
3. [Исходный код коллекции DNS .ton](https://tonscan.org/address/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz#source)
4. [Исходный код коллекции .t.me DNS](https://tonscan.org/address/EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi#source)
5. [Поисковик доменных контрактов](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source)
6. [Простой код менеджера поддоменов](https://github.com/Gusarich/simple-subdomain/blob/198485bbc9f7f6632165b7ab943902d4e125d81a/contracts/subdomain-manager.fc)

## Поисковик доменных контрактов

Поддомены имеют практическое применение. Например, в блокчейн-эксплорерах на данный момент нет способа найти доменный контракт по его названию. Давайте разберемся, как создать контракт, который позволит находить такие домены.

:::info
This contract is deployed at [EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH\_Zp](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source) and linked to `resolve-contract.ton`. To test it, you may write `<your-domain.ton>.resolve-contract.ton` in the address bar of your favourite TON explorer and get to the page of TON DNS domain contract. This resolves to the corresponding TON DNS domain contract page. Subdomains and .t.me domains are supported as well.

Вы можете попытаться просмотреть код резолвера, перейдя по адресу `resolve-contract.ton.resolve-contract.ton`. Однако это не покажет вам субрезолвер (так как это отдельный смарт-контракт), а лишь страницу самого доменного контракта. Instead, it displays the domain contract itself.
:::

### Код dnsresolve()

Некоторые повторяющиеся части опущены.

```func
(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; assuming that 'subdomain' is not empty
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; current contract has no DNS records by itself
      return (8, null());
    }
  }
  
  ;; we are loading some subdomain
  ;; supported subdomains are "ton\\0", "me\\0t\\0" and "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; we're resolving
    ;; "ton" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(32);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_ton_dns_nft_address_by_index(slice_hash(subdomain));
  } elseif (subdomain.starts_with("6164647265737300"s)) {
    subdomain~skip_bits(64);
    
    domain_nft_address = subdomain~decode_base64_address_to(begin_cell());
    
    subdomain_sfx = subdomain;
    if (~ subdomain_sfx.slice_empty?()) {
      throw_unless(71, subdomain_sfx~load_uint(8) == 0);
    }
  } else {
    return (0, null());
  }
  
  if (slice_empty?(subdomain_sfx)) {
    ;; example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; we want the resolve result to point at contract of 'ratelance.ton', not its owner
    ;; so we must answer that resolution is complete + "wallet"H is address of 'ratelance.ton' contract
    
    ;; dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 } cap_list:flags . 0?SmcCapList = DNSRecord;
    ;; _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
    
    cell wallet_record = begin_cell().store_uint(0x9fd3, 16).store_builder(domain_nft_address).store_uint(0, 8).end_cell();
    
    if (category == 0) {
      cell dns_dict = new_dict();
      dns_dict~udict_set_ref(256, "wallet"H, wallet_record);
      return (subdomain_bits, dns_dict);
    } elseif (category == "wallet"H) {
      return (subdomain_bits, wallet_record);
    } else {
      return (subdomain_bits, null());
    }
  } else {
    ;; subdomain          "resolve-contract"
    ;; subdomain_sfx      "ton\\0ratelance\\0"
    ;; we want to pass \\0 further, so that next resolver has opportunity to process only one byte
    
    ;; next resolver is contract of 'resolve-contract<.ton>'
    ;; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
    cell resolver_record = begin_cell().store_uint(0xba93, 16).store_builder(domain_nft_address).end_cell();
    return (subdomain_bits - slice_bits(subdomain_sfx) - 8, resolver_record);
  }
}
```

### Объяснение функции dnsresolve()

Here's a step-by-step breakdown of when a user resolves a domain like `stabletimer.ton.resolve-contract.ton`:

1. Пользователь запрашивает `"stabletimer.ton.resolve-contract.ton"`.
2. Приложение преобразует этот запрос в `"\0ton\0resolve-contract\0ton\0stabletimer\0"` (первый нулевой байт необязателен).  Note: the leading null byte is optional.
3. Корневой DNS-резолвер перенаправляет запрос в коллекцию TON DNS, оставшаяся часть -`"\0resolve-contract\0ton\0stabletimer\0"`.
4. Коллекция TON DNS делегирует запрос определенному домену, оставляя `"\0ton\0stabletimer\0"`.
5. The `.ton` DNS domain contract passes the resolution to the subresolver specified by the editor. The subdomain is: `"ton\0stabletimer\0"`.

**В этот момент вызывается dnsresolve().** Пошаговый разбор работы функции:

Таким образом, dnsresolve() может:

1. Она принимает в качестве входных данных поддомен и категорию.
2. Если в начале присутствует нулевой байт, он пропускается.
3. Она проверяет, начинается ли поддомен с `"ton\0"`. Если да, то
  - Она пропускает первые 32 бита (поддомен = `"resolve-contract\0"`)
  - A suffix variable `subdomain_sfx` is set to the `subdomain`. It reads bytes until the zero byte.
  - (subdomain = `"resolve-contract\0"`, subdomain_sfx = `""`)
  - Доменный контракт .TON DNS передает разрешение субрезолверу, указанному редактором, поддомен - `"ton\0stabletimer\0"`.
  - Функции slice_hash и get_ton_dns_nft_address_by_index используются для преобразования доменного имени в адрес контракта. Code of resolve-contract.ton|Appendix 1]].
4. Нулевой байт и subdomain_sfx удаляются с конца среза поддомена subdomain (subdomain = `"resolve-contract"`)
  - Если да, то он пропускает этот префикс и считывает адрес в формате base64.
5. If the subdomain doesn't match any known prefix:
  - The function returns `(0, null())`, indicating a failed resolution with no entries.
6. Значение `subdomain_sfx` устанавливается на `subdomain`, и функция считывает байты до нулевого байта
  - If **yes**, the request is considered fully resolved.
    - dnsresolve() создает DNS-запись для подраздела "wallet" домена, используя полученный адрес контракта TON Domain.
    - Если запрашивается категория 0 (все DNS-записи), запись оборачивается в словарь и возвращается.
    - Если запрашивается категория "wallet"H, запись возвращается как есть.
    - The function returns a successful resolution for any other category with no matching record.
  - If **not**, the request is only partially resolved.
    - Полученный ранее адрес контракта используется как следующий резолвер. Функция создает запись следующего резолвера, указывающую на него.
    - `"\0ton\0stabletimer\0"` передается дальше в этот контракт: обработанные биты — это биты поддомена.

Если переданный поддомен не соответствует ни одному из этих префиксов, функция указывает на неудачу, возвращая `(0, null())` (префикс с нулевыми байтами разрешен без записей DNS).

- Полностью преобразовать поддомен в DNS-запись
- Partially resolve it, delegating to another resolver contract.
- Вернуть результат "домен не найден" для неизвестных поддоменов

:::warning
Base64 address parsing is currently not functional. На самом деле, синтаксический анализ адресов в формате base64 не работает: если вы попытаетесь ввести `<some-address>.address.resolve-contract.ton`, вы получите ошибку о том, что домен неправильно настроен или не существует. This issue arises because domain names are case-insensitive—a behavior inherited from traditional DNS, which results in the lowercase. Consequently, the resolver may attempt to query a non-existent or invalid WorkChain address.
:::

### Binding the resolver

Теперь, когда контракт субрезолвера развернут, нам нужно привязать к нему домен, то есть изменить запись домена `dns_next_resolver`. Это можно сделать, отправив сообщение с следующей структурой TL-B в доменный контракт.

```
`change_dns_record#4eb1f0f9 query_id:uint64 record_key#19f02441ee588fdb26ee24b2568dd035c3c9206e11ab979be62e55558a1d17ff record:^[dns_next_resolver#ba93 resolver:MsgAddressInt]`
```

## Создание собственного менеджера поддоменов

Subdomains can be helpful for everyday users. Поддомены могут быть полезны обычным пользователям — например, для привязки нескольких проектов к одному домену или для связи с кошельками друзей.

### Данные контракта

В данных контракта необходимо хранить адрес владельца и словарь вида _domain_->_record hash_->_record value_.

```func
global slice owner;
global cell domains;

() load_data() impure {
  slice ds = get_data().begin_parse();
  owner = ds~load_msg_addr();
  domains = ds~load_dict();
}
() save_data() impure {
  set_data(begin_cell().store_slice(owner).store_dict(domains).end_cell());
}
```

### Обработка обновления записей

```func
const int op::update_record = 0x537a3491;
;; op::update_record#537a3491 domain_name:^Cell record_key:uint256
;;     value:(Maybe ^Cell) = InMsgBody;

() recv_internal(cell in_msg, slice in_msg_body) {
  if (in_msg_body.slice_empty?()) { return (); }   ;; simple money transfer

  slice in_msg_full = in_msg.begin_parse();
  if (in_msg_full~load_uint(4) & 1) { return (); } ;; bounced message

  slice sender = in_msg_full~load_msg_addr();
  load_data();
  throw_unless(501, equal_slices(sender, owner));
  
  int op = in_msg_body~load_uint(32);
  if (op == op::update_record) {
    slice domain = in_msg_body~load_ref().begin_parse();
    (cell records, _) = domains.udict_get_ref?(256, string_hash(domain));

    int key = in_msg_body~load_uint(256);
    throw_if(502, key == 0);  ;; cannot update "all records" record

    if (in_msg_body~load_uint(1) == 1) {
      cell value = in_msg_body~load_ref();
      records~udict_set_ref(256, key, value);
    } else {
      records~udict_delete?(256, key);
    }

    domains~udict_set_ref(256, string_hash(domain), records);
    save_data();
  }
}
```

We begin by verifying that the incoming message:

- Contains a valid request
- Is not bounced
- Comes from the owner
- Specifies the `op::update_record` operation.

Затем мы загружаем доменное имя из сообщения. Мы не можем хранить домены в словаре в исходном виде: они могут иметь разную длину, но не-префиксные словари TVM могут содержать только ключи одинаковой длины. Поэтому мы вычисляем `string_hash(domain)` - SHA-256 доменного имени; доменное имя гарантированно содержит целое число октетов, поэтому это работает. Domain names are guaranteed to contain an integer number of octets, so hashing them is safe and consistent.

После этого мы обновляем запись для указанного домена и сохраняем новые данные в хранилище контракта.

### Resolving domains

```func
(slice, slice) ~parse_sd(slice subdomain) {
  ;; "test\0qwerty\0" -> "test" "qwerty\0"
  slice subdomain_sfx = subdomain;
  while (subdomain_sfx~load_uint(8)) { }  ;; searching zero byte
  subdomain~skip_last_bits(slice_bits(subdomain_sfx));
  return (subdomain, subdomain_sfx);
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, subdomain_bits % 8 == 0);
  if (subdomain.preload_uint(8) == 0) { subdomain~skip_bits(8); }
  
  slice subdomain_suffix = subdomain~parse_sd();  ;; "test\0" -> "test" ""
  int subdomain_suffix_bits = slice_bits(subdomain_suffix);

  load_data();
  (cell records, _) = domains.udict_get_ref?(256, string_hash(subdomain));

  if (subdomain_suffix_bits > 0) { ;; more than "<SUBDOMAIN>\0" requested
    category = "dns_next_resolver"H;
  }

  int resolved = subdomain_bits - subdomain_suffix_bits;

  if (category == 0) { ;; all categories are requested
    return (resolved, records);
  }

  (cell value, int found) = records.udict_get_ref?(256, category);
  return (resolved, value);
}
```

Функция `dnsresolve` проверяет, содержит ли запрашиваемый поддомен целое число октетов, пропускает необязательный нулевой байт в начале среза поддомена, затем разделяет его на домен верхнего уровня и остальную часть (`test\0qwerty\0` разделяется на `test` и `qwerty\0`). It skips an optional zero byte at the start of the subdomain slice, then splits the slice into the top-level domain and the remaining portion. For example, `test\0qwerty\0` is split into `test` and `qwerty\0`. Загружается словарь записей, соответствующий запрашиваемому домену.

Если есть непустой суффикс поддомена, функция возвращает количество разрешённых байтов и следующую запись резолвера, найденную по ключу `"dns_next_resolver"H`. В противном случае функция возвращает количество разрешённых байтов (то есть полную длину фрагмента) и запрошенную запись.

Существует способ улучшить эту функцию, более корректно обрабатывая ошибки, но это не является обязательным.

## Приложение 1. Код resolve-contract.ton

<details><summary>subresolver.fc</summary>

```func showLineNumbers
(builder, ()) ~store_slice(builder to, slice s) asm "STSLICER";
int starts_with(slice a, slice b) asm "SDPFXREV";

const slice ton_dns_minter = "EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz"a;
cell ton_dns_domain_code() asm """
  B{<TON DNS NFT code in HEX format>}
  B>boc
  PUSHREF
""";

const slice tme_minter = "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi"a;
cell tme_domain_code() asm """
  B{<T.ME NFT code in HEX format>}
  B>boc
  PUSHREF
""";

cell calculate_ton_dns_nft_item_state_init(int item_index) inline {
  cell data = begin_cell().store_uint(item_index, 256).store_slice(ton_dns_minter).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(ton_dns_domain_code()).store_dict(data).store_uint(0, 1).end_cell();
}

cell calculate_tme_nft_item_state_init(int item_index) inline {
  cell config = begin_cell().store_uint(item_index, 256).store_slice(tme_minter).end_cell();
  cell data = begin_cell().store_ref(config).store_maybe_ref(null()).end_cell();
  return begin_cell().store_uint(0, 2).store_dict(tme_domain_code()).store_dict(data).store_uint(0, 1).end_cell();
}

builder calculate_nft_item_address(int wc, cell state_init) inline {
  return begin_cell()
      .store_uint(4, 3)
      .store_int(wc, 8)
      .store_uint(cell_hash(state_init), 256);
}

builder get_ton_dns_nft_address_by_index(int index) inline {
  cell state_init = calculate_ton_dns_nft_item_state_init(index);
  return calculate_nft_item_address(0, state_init);
}

builder get_tme_nft_address_by_index(int index) inline {
  cell state_init = calculate_tme_nft_item_state_init(index);
  return calculate_nft_item_address(0, state_init);
}

(slice, builder) decode_base64_address_to(slice readable, builder target) inline {
  builder addr_with_flags = begin_cell();
  repeat(48) {
    int char = readable~load_uint(8);
    if (char >= "a"u) {
      addr_with_flags~store_uint(char - "a"u + 26, 6);
    } elseif ((char == "_"u) | (char == "/"u)) {
      addr_with_flags~store_uint(63, 6);
    } elseif (char >= "A"u) {
      addr_with_flags~store_uint(char - "A"u, 6);
    } elseif (char >= "0"u) {
      addr_with_flags~store_uint(char - "0"u + 52, 6);
    } else {
      addr_with_flags~store_uint(62, 6);
    }
  }
  
  slice addr_with_flags = addr_with_flags.end_cell().begin_parse();
  addr_with_flags~skip_bits(8);
  addr_with_flags~skip_last_bits(16);
  
  target~store_uint(4, 3);
  target~store_slice(addr_with_flags);
  return (readable, target);
}

slice decode_base64_address(slice readable) method_id {
  (slice _remaining, builder addr) = decode_base64_address_to(readable, begin_cell());
  return addr.end_cell().begin_parse();
}

(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);

  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; assuming that 'subdomain' is not empty
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; current contract has no DNS records by itself
      return (8, null());
    }
  }
  
  ;; we are loading some subdomain
  ;; supported subdomains are "ton\\0", "me\\0t\\0" and "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; we're resolving
    ;; "ton" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(32);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_ton_dns_nft_address_by_index(slice_hash(subdomain));
  } elseif (subdomain.starts_with("6D65007400"s)) {
    ;; "t" \\0 "me" \\0 <subdomain> \\0 [subdomain_sfx]
    subdomain~skip_bits(40);
    
    ;; reading domain name
    subdomain_sfx = subdomain;
    while (subdomain_sfx~load_uint(8)) { }
    
    subdomain~skip_last_bits(8 + slice_bits(subdomain_sfx));
    
    domain_nft_address = get_tme_nft_address_by_index(string_hash(subdomain));
  } elseif (subdomain.starts_with("6164647265737300"s)) {
    subdomain~skip_bits(64);
    
    domain_nft_address = subdomain~decode_base64_address_to(begin_cell());
    
    subdomain_sfx = subdomain;
    if (~ subdomain_sfx.slice_empty?()) {
      throw_unless(71, subdomain_sfx~load_uint(8) == 0);
    }
  } else {
    return (0, null());
  }
  
  if (slice_empty?(subdomain_sfx)) {
    ;; example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; we want the resolve result to point at contract of 'ratelance.ton', not its owner
    ;; so we must answer that resolution is complete + "wallet"H is address of 'ratelance.ton' contract
    
    ;; dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 } cap_list:flags . 0?SmcCapList = DNSRecord;
    ;; _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;
    
    cell wallet_record = begin_cell().store_uint(0x9fd3, 16).store_builder(domain_nft_address).store_uint(0, 8).end_cell();
    
    if (category == 0) {
      cell dns_dict = new_dict();
      dns_dict~udict_set_ref(256, "wallet"H, wallet_record);
      return (subdomain_bits, dns_dict);
    } elseif (category == "wallet"H) {
      return (subdomain_bits, wallet_record);
    } else {
      return (subdomain_bits, null());
    }
  } else {
    ;; example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; subdomain          "resolve-contract"
    ;; subdomain_sfx      "ton\\0ratelance\\0"
    ;; and we want to pass \\0 further, so that next resolver has opportunity to process only one byte
    
    ;; next resolver is contract of 'resolve-contract<.ton>'
    ;; dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;
    cell resolver_record = begin_cell().store_uint(0xba93, 16).store_builder(domain_nft_address).end_cell();
    return (subdomain_bits - slice_bits(subdomain_sfx) - 8, resolver_record);
  }
}

() recv_internal() {
  return ();
}
```

</details>

<Feedback />

