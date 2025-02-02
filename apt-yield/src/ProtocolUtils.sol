// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library ProtocolUtils {
    /**
     * @dev Deposits tokens into a protocol.
     * @param token The address of the token to deposit.
     * @param protocol The address of the protocol.
     * @param amount The amount of tokens to deposit.
     */
    function deposit(address token, address protocol, uint256 amount) internal {
        require(token != address(0) && protocol != address(0), "Invalid address");
        IERC20(token).approve(protocol, amount);

        (bool success, bytes memory data) = protocol.call(
            abi.encodeWithSignature("deposit(address,uint256)", token, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Deposit failed");
    }

    /**
     * @dev Withdraws tokens from a protocol.
     * @param token The address of the token to withdraw.
     * @param protocol The address of the protocol.
     * @param amount The amount of tokens to withdraw.
     */
    function withdraw(address token, address protocol, uint256 amount) internal {
        require(token != address(0) && protocol != address(0), "Invalid address");

        (bool success, bytes memory data) = protocol.call(
            abi.encodeWithSignature("withdraw(address,uint256)", token, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Withdrawal failed");
    }
}