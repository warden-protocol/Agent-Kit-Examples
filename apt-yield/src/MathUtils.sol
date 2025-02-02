// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

library MathUtils {
    /**
     * @dev Calculates the difference between two APYs.
     * @param apy1 The first APY (in basis points, e.g., 500 for 5%).
     * @param apy2 The second APY (in basis points).
     * @return The absolute difference between the two APYs.
     */
    function calculateApyDifference(uint256 apy1, uint256 apy2) internal pure returns (uint256) {
        return apy1 > apy2 ? apy1 - apy2 : apy2 - apy1;
    }

    /**
     * @dev Checks if the APY difference exceeds a threshold.
     * @param apy1 The first APY (in basis points).
     * @param apy2 The second APY (in basis points).
     * @param threshold The threshold (in basis points).
     * @return True if the difference exceeds the threshold, false otherwise.
     */
    function isApyDifferenceSignificant(uint256 apy1, uint256 apy2, uint256 threshold) internal pure returns (bool) {
        return calculateApyDifference(apy1, apy2) > threshold;
    }
}