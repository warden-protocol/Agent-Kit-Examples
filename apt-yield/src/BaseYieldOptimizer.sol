// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ReentrancyGuard.sol";
import "./AddressUtils.sol";

abstract contract BaseYieldOptimizer is ReentrancyGuard {
    using AddressUtils for address;

    address public agent; // Address of the agent (admin)
    address public registry; // Address of the Registry contract

    event Rebalanced(address indexed token, uint256 amount, address indexed protocol);

    modifier onlyAgent() {
        require(msg.sender == agent, "BaseYieldOptimizer: caller is not the agent");
        _;
    }

    constructor(address _agent, address _registry) {
        require(_agent.isContract() == false, "BaseYieldOptimizer: agent must be an EOA");
        require(_registry.isContract(), "BaseYieldOptimizer: registry must be a contract");

        agent = _agent;
        registry = _registry;
    }

    /**
     * @dev Updates the agent address.
     * @param newAgent The new agent address.
     */
    function updateAgent(address newAgent) external onlyAgent {
        require(newAgent.isContract() == false, "BaseYieldOptimizer: agent must be an EOA");
        agent = newAgent;
    }

    /**
     * @dev Internal function to emit a rebalance event.
     * @param token The address of the token being rebalanced.
     * @param amount The amount of tokens being rebalanced.
     * @param protocol The address of the target protocol.
     */
    function _emitRebalanced(address token, uint256 amount, address protocol) internal virtual{
        emit Rebalanced(token, amount, protocol);
    }
}