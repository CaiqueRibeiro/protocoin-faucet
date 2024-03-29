// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProtoCoin is ERC20 {
    address private _owner;
    uint private _mintAmount = 0;
    uint64 private _mintDelay = 60 * 60 * 24; // 1 day in seconds

    mapping(address => uint256) private _nextMint;

    constructor() ERC20("ProtoCoinV2", "NPTC") {
        _owner = msg.sender;
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    function mint() public {
        require(_mintAmount > 0, "Minting is not enabled");
        require(
            block.timestamp >= _nextMint[msg.sender],
            "You cannot mint twice in a day"
        );
        _mint(msg.sender, _mintAmount);
        _nextMint[msg.sender] = block.timestamp + _mintDelay;
    }

    function setMintAmount(uint newAmount) public restricted {
        _mintAmount = newAmount;
    }

    function setMintDelay(uint64 delayInSeconds) public restricted {
        _mintDelay = delayInSeconds;
    }

    modifier restricted() {
        require(msg.sender == _owner, "Only owner can call this function");
        _;
    }
}
