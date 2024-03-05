// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProtoCoin is ERC20 {
    constructor() ERC20("ProtoCoin", "PTC") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}
