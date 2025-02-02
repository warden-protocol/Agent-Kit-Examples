// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract Registry {
    struct OptimizerData {
        address optimizer;
        uint256 apyThreshold;
        uint256 lastRebalanceTimestamp;
    }

    mapping(address => OptimizerData) public optimizers;

    event OptimizerRegistered(address indexed optimizer, uint256 apyThreshold);

    /**
     * @dev Registers a new optimizer.
     * @param optimizer The address of the optimizer.
     * @param apyThreshold The APY threshold for rebalancing.
     */
    function registerOptimizer(address optimizer, uint256 apyThreshold) external {
        optimizers[optimizer] = OptimizerData({
            optimizer: optimizer,
            apyThreshold: apyThreshold,
            lastRebalanceTimestamp: block.timestamp
        });

        emit OptimizerRegistered(optimizer, apyThreshold);
    }

    /**
     * @dev Updates the last rebalance timestamp for an optimizer.
     * @param optimizer The address of the optimizer.
     */
    function updateLastRebalance(address optimizer) external {
        optimizers[optimizer].lastRebalanceTimestamp = block.timestamp;
    }
}