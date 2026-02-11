// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TresuruUSD
 * @notice Mock TIP-20 stablecoin for Tresuru treasury testing on Tempo Testnet.
 *         Anyone can mint on testnet. 18 decimals, pegged to $1 USD.
 */
contract TresuruUSD is ERC20 {
    constructor() ERC20("TresuruUSD", "trUSD") {
        // Mint 100M trUSD to deployer for initial distribution
        _mint(msg.sender, 100_000_000 * 10 ** decimals());
    }

    /// @notice Testnet-only: anyone can mint tokens for testing
    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }

    /// @notice Testnet-only: mint to yourself
    function faucet(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }
}
