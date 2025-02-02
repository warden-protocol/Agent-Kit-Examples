// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

library AddressUtils {
    /**
     * @dev Checks if an address is a contract.
     * @param addr The address to check.
     * @return True if the address is a contract, false otherwise.
     */
    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    /**
     * @dev Ensures that an address is not zero.
     * @param addr The address to check.
     */
    function requireNonZero(address addr) internal pure {
        require(addr != address(0), "Address cannot be zero");
    }
}