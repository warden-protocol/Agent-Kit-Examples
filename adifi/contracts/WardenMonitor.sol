// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WardenMonitor {
    struct MarketData {
        uint256 timestamp;
        uint256 volume;
        uint256 liquidity;
        string aiAnalysis;
    }
    
    MarketData[] public historicalData;
    mapping(address => string) public userAlerts;
    
    event NewDataPoint(uint256 timestamp, uint256 volume, uint256 liquidity);
    event AlertCreated(address user, string alertConfig);
    
    function addMarketData(uint256 volume, uint256 liquidity, string memory analysis) public {
        historicalData.push(MarketData({
            timestamp: block.timestamp,
            volume: volume,
            liquidity: liquidity,
            aiAnalysis: analysis
        }));
        
        emit NewDataPoint(block.timestamp, volume, liquidity);
    }
    
    function setAlertConfig(string memory alertConfig) public {
        userAlerts[msg.sender] = alertConfig;
        emit AlertCreated(msg.sender, alertConfig);
    }
} 