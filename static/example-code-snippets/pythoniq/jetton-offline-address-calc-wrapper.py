from pytoniq_core import Address, Cell, begin_cell


def calculate_jetton_address(
    owner_address: Address, jetton_master_address: Address, jetton_wallet_code: str
):
    # Recreate from jetton-utils.fc calculate_jetton_wallet_address()
    # https://tonscan.org/jetton/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs#source

    data_cell = (
        begin_cell()
        .store_uint(0, 4)
        .store_coins(0)
        .store_address(owner_address)
        .store_address(jetton_master_address)
        .end_cell()
    )

    code_cell = Cell.one_from_boc(jetton_wallet_code)

    state_init = (
        begin_cell()
        .store_uint(0, 2)
        .store_maybe_ref(code_cell)
        .store_maybe_ref(data_cell)
        .store_uint(0, 1)
        .end_cell()
    )
    state_init_hex = state_init.hash.hex()
    jetton_address = Address(f'0:{state_init_hex}')

    return jetton_address


def print_debug(d: dict):
    for k, v in d.items():
        print(f'{k: <25} {v}')


if __name__ == '__main__':
    # https://docs.ton.org/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address-offline
    # https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs?section=method
    # Execute "get_jetton_data" and copy last cell value (should be jetton_wallet_code, but they don't match)
    jetton_wallet_code = 'b5ee9c72010101010023000842028f452d7a4dfd74066b682365177259ed05734435be76b5fd4bd5d8af2b7c3d68'

    # USDT contract
    jetton_master_address = Address('EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs')

    # User address
    owner_address = Address('UQANCZLrRHVnenvs31J26Y6vUcirln0-6zs_U18w93WaN2da')

    debug = {
        'jetton_master_address': jetton_master_address.to_str(),
        'owner_address': owner_address.to_str(is_bounceable=False),
    }

    jetton_address_calc = calculate_jetton_address(
        owner_address, jetton_master_address, jetton_wallet_code
    )
    jetton_address_calc_str = jetton_address_calc.to_str(
        is_user_friendly=True, is_url_safe=True, is_bounceable=False
    )
    debug['jetton_address calc'] = jetton_address_calc_str

    jetton_addr_by_node = 'UQAXgYVGR0rl2az6qPJcPlxFyiNKPCQckoI2ZXaGxLnWJGUf'
    debug['jetton_address by_node'] = jetton_addr_by_node

    debug['match'] = jetton_addr_by_node == jetton_address_calc_str

    print_debug(debug)