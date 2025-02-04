// SPDX-License-Identifier: MIT
pragma solidity >=0.8.25 <0.9.0;

import {Test} from "lib/forge-std/src/Test.sol";
import {YieldOptimizer} from "../src/YieldOptimizer.sol";
import {Registry} from "../src/Registry.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("MockToken", "MTK") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract MockRegistry is Registry {
    mapping(address => uint256) public lastRebalanceTimestamps;

    function updateLastRebalance(address optimizer) external override {
        lastRebalanceTimestamps[optimizer] = block.timestamp;
    }
}

contract YieldOptimizerTest is Test {
    event Rebalanced(address indexed token, uint256 amount, address indexed protocol);
    
    YieldOptimizer optimizer;
    MockRegistry registry;
    MockToken token;
    address agent;
    address protocolA;
    address protocolB;

    function setUp() public {
        agent = address(0x123);
        registry = new MockRegistry();
        optimizer = new YieldOptimizer(agent, address(registry), 200);
        token = new MockToken();
        protocolA = address(0x456);
        protocolB = address(0x789);

        token.mint(address(optimizer), 1000 ether);
    }

    function testRebalance() public {
        uint256 initialBalance = token.balanceOf(address(optimizer));
        
        // Mock protocol interactions using function selectors
        bytes4 withdrawSelector = bytes4(keccak256("withdraw(address,uint256)"));
        bytes4 depositSelector = bytes4(keccak256("deposit(address,uint256)"));
        
        vm.mockCall(
            protocolA,
            withdrawSelector,
            abi.encode(true)
        );
        
        vm.mockCall(
            protocolB,
            depositSelector,
            abi.encode(true)
        );

        // Expect Rebalanced event
        vm.expectEmit(true, true, true, true);
        emit Rebalanced(address(token), 500 ether, protocolB);

        // Execute rebalance
        vm.prank(agent);
        optimizer.rebalance(address(token), 500 ether, protocolA, protocolB);

        // Verify balances remain unchanged (mock transfers)
        assertEq(token.balanceOf(address(optimizer)), initialBalance, "Balance should remain the same");
        
        // Verify registry update
        assertEq(
            registry.lastRebalanceTimestamps(address(optimizer)), 
            block.timestamp,
            "Registry timestamp should be updated"
        );
    }

    function testRebalanceRevertsForZeroAddress() public {
        vm.prank(agent);
        vm.expectRevert("YieldOptimizer: token address cannot be zero");
        optimizer.rebalance(address(0), 500 ether, protocolA, protocolB);
    }

    function testOnlyAgentCanRebalance() public {
        vm.prank(address(0x999));
        vm.expectRevert("BaseYieldOptimizer: caller is not the agent");
        optimizer.rebalance(address(token), 500 ether, protocolA, protocolB);
    }

    function testUpdateApyThreshold() public {
        vm.startPrank(agent);
        optimizer.updateApyThreshold(300);
        assertEq(optimizer.apyThreshold(), 300, "APY threshold should be updated");
        
        vm.expectRevert("BaseYieldOptimizer: caller is not the agent");
        vm.stopPrank();
        optimizer.updateApyThreshold(400);
    }
}