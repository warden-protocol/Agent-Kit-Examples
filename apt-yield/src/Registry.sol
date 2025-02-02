// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract Registry {
    struct OptimizerData {
        address optimizer;
        address agent;  
        uint256 apyThreshold;
        uint256 lastRebalanceTimestamp;
    }

    // Mapping to store the OptimizerData for each optimizer
    mapping(address => OptimizerData) public optimizers;

    // Event emitted when an optimizer is registered
    event OptimizerRegistered(address indexed optimizer, address indexed agent, uint256 apyThreshold);

    // Event emitted when a rebalance is updated
    event RebalanceUpdated(address indexed optimizer, uint256 timestamp);

    /**
     * @dev Registers a new optimizer.
     * @param optimizer The address of the optimizer.
     * @param agent The address of the associated agent.
     * @param apyThreshold The APY threshold for rebalancing.
     */
    function registerOptimizer(address optimizer, address agent, uint256 apyThreshold) external {
        require(optimizer != address(0), "Invalid optimizer address");
        require(agent != address(0), "Invalid agent address");
        require(apyThreshold > 0, "APY threshold must be greater than zero");

         // Store the optimizer data
        optimizers[optimizer] = OptimizerData({
            optimizer: optimizer,
            agent: agent,
            apyThreshold: apyThreshold,
            lastRebalanceTimestamp: block.timestamp
        });

        // Emit the event for optimizer registration
        emit OptimizerRegistered(optimizer, agent, apyThreshold);
    }

    /**
     * @dev Updates the last rebalance timestamp for an optimizer.
     * @param optimizer The address of the optimizer.
     */
    function updateLastRebalance(address optimizer) external virtual {
        require(optimizers[optimizer].optimizer != address(0), "Optimizer not registered");

        // Update the rebalance timestamp
        optimizers[optimizer].lastRebalanceTimestamp = block.timestamp;

        // Emit the event for rebalance update
        emit RebalanceUpdated(optimizer, block.timestamp);
    }
}