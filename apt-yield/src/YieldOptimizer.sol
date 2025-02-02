// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./BaseYieldOptimizer.sol";
import "./TokenUtils.sol";
import "./ProtocolUtils.sol";
import "./MathUtils.sol";
import "./Registry.sol";

contract YieldOptimizer is BaseYieldOptimizer {
    using TokenUtils for address;
    using ProtocolUtils for address;
    using MathUtils for uint256;

    uint256 public apyThreshold; // APY difference threshold for rebalancing

    constructor(
        address _agent,
        address _registry,
        uint256 _apyThreshold
    ) BaseYieldOptimizer(_agent, _registry) {
        apyThreshold = _apyThreshold;
    }

    /**
     * @dev Rebalances funds between two protocols.
     * @param token The address of the token to rebalance.
     * @param amount The amount of tokens to rebalance.
     * @param fromProtocol The address of the source protocol.
     * @param toProtocol The address of the target protocol.
     */
    function rebalance(
        address token,
        uint256 amount,
        address fromProtocol,
        address toProtocol
    ) external onlyAgent nonReentrant {
        require(token != address(0), "YieldOptimizer: token address cannot be zero");
        require(fromProtocol != address(0), "YieldOptimizer: fromProtocol address cannot be zero");
        require(toProtocol != address(0), "YieldOptimizer: toProtocol address cannot be zero");

        // Withdraw tokens from the source protocol
        (bool successWithdraw, ) = fromProtocol.call(
            abi.encodeWithSignature("withdraw(address,uint256)", token, amount)
        );
        require(successWithdraw, "Withdrawal failed");

        // Deposit tokens into the target protocol
        (bool successDeposit, ) = toProtocol.call(
            abi.encodeWithSignature("deposit(address,uint256)", token, amount)
        );
        require(successDeposit, "Deposit failed");

        // Emit rebalance event
        _emitRebalanced(token, amount, toProtocol);
    }

    /**
     * @dev Updates the APY threshold for rebalancing.
     * @param newThreshold The new APY threshold.
     */
    function updateApyThreshold(uint256 newThreshold) external onlyAgent {
        apyThreshold = newThreshold;
    }

    /**
     * @dev Logs a rebalance event in the Registry.
     * @param token The address of the token being rebalanced.
     * @param amount The amount of tokens being rebalanced.
     * @param protocol The address of the target protocol.
     */
    
    function _logRebalance(address token, uint256 amount, address protocol) internal {
        Registry(registry).updateLastRebalance(address(this));
    }

    // Override _emitRebalanced to log rebalance events
    function _emitRebalanced(address token, uint256 amount, address protocol) internal override {
        super._emitRebalanced(token, amount, protocol);
        _logRebalance(token, amount, protocol);
    }
}