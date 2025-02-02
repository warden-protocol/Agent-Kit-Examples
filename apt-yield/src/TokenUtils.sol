// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

library TokenUtils {
    /**
     * @dev Transfers tokens from the sender to a recipient.
     * @param token The address of the ERC-20 token.
     * @param from The sender's address.
     * @param to The recipient's address.
     * @param amount The amount of tokens to transfer.
     */
    function safeTransfer(
        address token,
        address from,
        address to,
        uint256 amount
    ) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Token transfer failed");
    }


    /**
     * @dev Approves tokens for spending by a spender.
     * @param token The address of the ERC-20 token.
     * @param spender The address of the spender.
     * @param amount The amount of tokens to approve.
     */
    function safeApprove(
        address token,
        address spender,
        uint256 amount
    ) internal {
        (bool success, bytes memory data) = token.call(
        abi.encodeWithSelector(IERC20.approve.selector, spender, amount)
    );
    require(success && (data.length == 0 || abi.decode(data, (bool))), "Token approval failed");
    }
}