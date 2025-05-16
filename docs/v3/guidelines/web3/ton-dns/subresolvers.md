import Feedback from '@site/src/components/Feedback';

# TON DNS resolvers

## Introduction

TON DNS is a powerful tool for assigning TON Sites or Storage bags to domains and configuring subdomain resolution.

## Relevant links

1. [TON smart contract address system](/v3/documentation/smart-contracts/addresses)
1. [TEP-0081 - TON DNS standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0081-dns-standard.md)
1. [Source code of .ton DNS collection](https://tonscan.org/address/EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz#source)
1. [Source code of .t.me DNS collection](https://tonscan.org/address/EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi#source)
1. [Domain contracts searcher](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source)
1. [Simple subdomain manager code](https://github.com/Gusarich/simple-subdomain/blob/198485bbc9f7f6632165b7ab943902d4e125d81a/contracts/subdomain-manager.fc)

## Domain contracts searcher

Subdomains provide helpful functionality. For example, most blockchain explorers do not support looking up a domain contract by its name. This section explains how to create a contract that enables this functionality.


:::info
The example contract is deployed at [EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp](https://tonscan.org/address/EQDkAbAZNb4uk-6pzTPDO2s0tXZweN-2R08T2Wy6Z3qzH_Zp#source) and is associated with `resolve-contract.ton`. To test it, enter `<your-domain.ton>.resolve-contract.ton` in the address bar of your preferred TON explorer. This resolves to the corresponding TON DNS domain contract page. Subdomains and `.t.me` domains are supported. 

To view the resolver’s code, navigate to `resolve-contract.ton.resolve-contract.ton`. Note that this does not show the subresolver contract; it is a separate smart contract. Instead, it displays the domain contract itself.
:::

### dnsresolve() code

Some repetitive parts are omitted.

```func
(int, cell) dnsresolve(slice subdomain, int category) method_id {
  int subdomain_bits = slice_bits(subdomain);
  throw_unless(70, (subdomain_bits % 8) == 0);
  
  int starts_with_zero_byte = subdomain.preload_int(8) == 0;  ;; Assuming that 'subdomain' is not empty.
  if (starts_with_zero_byte) {
    subdomain~load_uint(8);
    if (subdomain.slice_bits() == 0) {   ;; Current contract has no DNS records by itself.
      return (8, null());
    }
  }
  
  ;; We are loading some subdomain.
  ;; Supported subdomains are "ton\\0", "me\\0t\\0" and "address\\0"
  
  slice subdomain_sfx = null();
  builder domain_nft_address = null();
  
  if (subdomain.starts_with("746F6E00"s)) {
    ;; we are resolving
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
    ;; Example of domain being resolved:
    ;; [initial, not accessible in this contract] "ton\\0resolve-contract\\0ton\\0ratelance\\0"
    ;; [what is accessible by this contract]      "ton\\0ratelance\\0"
    ;; subdomain          "ratelance"
    ;; subdomain_sfx      ""
    
    ;; We want the resolved result to point to the 'ratelance.ton' contract, not its owner.
    ;; So we must answer that the resolution is complete + "wallet"H is the address of the 'ratelance.ton' contract
    
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

### dnsresolve() explanation
Here's a step-by-step breakdown of when a user resolves a domain like `stabletimer.ton.resolve-contract.ton`:

1. The user requests the domain: `"stabletimer.ton.resolve-contract.ton"`.
2. The application encodes it as a byte string: `"\0ton\0resolve-contract\0ton\0stabletimer\0"`.  Note: the leading null byte is optional.
3. The root DNS resolver forwards the request to the TON DNS collection, leaving: `"\0resolve-contract\0ton\0stabletimer\0"`.
4. The TON DNS collection delegates the request to the specified domain, leaving: `"\0ton\0stabletimer\0"`.
5. The `.ton` DNS domain contract passes the resolution to the subresolver specified by the editor. The subdomain is: `"ton\0stabletimer\0"`.

**At this point, the `dnsresolve()` is invoked.**

How `dnsresolve()` works:


1. It takes the subdomain and category as inputs. 
2. It is skipped if the subdomain begins with zero byte. 
3. It checks if the subdomain starts with `"ton\0"`. If it does:
   - The first 32 bits are skipped (`subdomain = "resolve-contract\0"`).  
   - A suffix variable `subdomain_sfx` is set to the `subdomain`. It reads bytes until the zero byte.
   - At this point: `subdomain = "resolve-contract\0", subdomain_sfx = "")`.
   - The zero byte and suffix are trimmed, resulting in `subdomain = "resolve-contract"`.
   - The domain name is converted into a contract address using helper functions `slice_hash` and `get_ton_dns_nft_address_by_index`. See [Appendix 1](subresolvers#appendix-1-code-of-resolve-contractton) for implementation details.
4. If the subdomain starts with `"address\0"`:
   - The prefix is skipped, and the rest is interpreted as a base64-encoded address.
5. If the subdomain doesn't match any known prefix:
   - The function returns `(0, null())`, indicating a failed resolution with no entries.
6. The function then checks if the `subdomain_sfx` is empty:
   - If **yes**, the request is considered fully resolved.
     - `dnsresolve()` generates a DNS record for the wallet subdomain using the previously retrieved TON DNS contract address.
     - If category 0, i.e., all DNS records, is requested, the result is wrapped in a dictionary and returned.
     - If the category is "wallet"H, the record is returned as-is.
     - The function returns a successful resolution for any other category with no matching record.
   - If **not**, the request is only partially resolved.
     - The function builds a resolver record pointing to the next contract associated with the domain.
     - The remaining subdomain `"\0ton\0stabletimer\0"` is forwarded to the contract, with the already processed bits corresponding to the initial part of the subdomain.


The `dnsresolve()` function can:
- Fully resolve a subdomain to a DNS record. 
- Partially resolve it, delegating to another resolver contract. 
- Return a "domain not found" result if the subdomain is unknown.

:::warning
Base64 address parsing is currently not functional. Suppose you attempt to resolve a domain like `<some-address>.address.resolve-contract.ton`, you will receive an error indicating that the domain is misconfigured or does not exist. This issue arises because domain names are case-insensitive—a behavior inherited from traditional DNS, which results in the lowercase. Consequently, the resolver may attempt to query a non-existent or invalid WorkChain address.
:::

### Binding the resolver

Now that the subresolver contract is deployed, the next step is to point the domain to it by updating domain `dns_next_resolver` record. This is done by sending a message with the following TL-B structure to the domain contract:
```
`change_dns_record#4eb1f0f9 query_id:uint64 record_key#19f02441ee588fdb26ee24b2568dd035c3c9206e11ab979be62e55558a1d17ff record:^[dns_next_resolver#ba93 resolver:MsgAddressInt]`
```

## Creating own subdomains manager
Subdomains can be helpful for everyday users. For example, they can associate multiple projects with a single domain or link to friends' wallet addresses.

### Contract data
The contract must store the owner's address and a dictionary structured as **domain → record hash → record value**.

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

### Processing records update

```func
const int op::update_record = 0x537a3491;
;; op::update_record#537a3491 domain_name:^Cell record_key:uint256
;;     value:(Maybe ^Cell) = InMsgBody;

() recv_internal(cell in_msg, slice in_msg_body) {
  if (in_msg_body.slice_empty?()) { return (); }   ;; Simple money transfer.

  slice in_msg_full = in_msg.begin_parse();
  if (in_msg_full~load_uint(4) & 1) { return (); } ;; Bounced message.

  slice sender = in_msg_full~load_msg_addr();
  load_data();
  throw_unless(501, equal_slices(sender, owner));
  
  int op = in_msg_body~load_uint(32);
  if (op == op::update_record) {
    slice domain = in_msg_body~load_ref().begin_parse();
    (cell records, _) = domains.udict_get_ref?(256, string_hash(domain));

    int key = in_msg_body~load_uint(256);
    throw_if(502, key == 0);  ;; Cannot update "all records" record.

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

Next, we extract the domain name from the message. Domains cannot be stored directly in a dictionary since they may vary in length — and TVM non-prefix dictionaries require keys of fixed length. To solve this, we compute `string_hash(domain)`, which is the SHA-256 hash of the domain name. Domain names are guaranteed to contain an integer number of octets, so hashing them is safe and consistent.

Finally, we update the record associated with the specified domain and write the new data to the contract storage.

### Resolving domains

```func
(slice, slice) ~parse_sd(slice subdomain) {
  ;; "test\0qwerty\0" -> "test" "qwerty\0"
  slice subdomain_sfx = subdomain;
  while (subdomain_sfx~load_uint(8)) { }  ;; Searching zero byte.
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

  if (subdomain_suffix_bits > 0) { ;; More than "<SUBDOMAIN>\0" requested.
    category = "dns_next_resolver"H;
  }

  int resolved = subdomain_bits - subdomain_suffix_bits;

  if (category == 0) { ;; All categories are requested.
    return (resolved, records);
  }

  (cell value, int found) = records.udict_get_ref?(256, category);
  return (resolved, value);
}
```

The `dnsresolve` function begins by verifying that the requested subdomain contains an integer number of octets. It skips an optional zero byte at the start of the subdomain slice, then splits the slice into the top-level domain and the remaining portion. For example, `test\0qwerty\0` is split into `test` and `qwerty\0`. Next, the function loads the record dictionary associated with the requested domain.

If a non-empty subdomain suffix remains, the function returns the number of bytes resolved along with the next resolver record, which is stored under the `"dns_next_resolver"H` key. Otherwise, it returns the total number of resolved bytes, i.e., the full slice length and the requested record.

While this function could be improved to handle errors more gracefully, such enhancements are not strictly required.

## Appendix 1: code of resolve-contract.ton

<details>
<summary>subresolver.fc</summary>

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

