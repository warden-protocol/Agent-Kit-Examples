#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::vec::Vec;
use alloc::string::String;
use stylus_sdk::stylus_proc::{entrypoint, public};
use stylus_sdk::{console,call::transfer_eth, contract, msg, prelude::*};
use alloy_sol_types::sol;
use stylus_sdk::alloy_primitives::{Address, U256};

/// A constant for basis points (10000 = 100%)
//const BASIS_POINTS: U256 = U256::from(10000);

sol!{
    error NotOwner(address from);
}

sol_storage! {
    #[entrypoint]
    pub struct PrizeDistributor {
        // The owner of the contract.
        address owner;
        // Indicates whether registration has been closed.
        bool registration_closed;
        // The total number of registered users.
        uint256 registered_count;
        // A mapping to track whether an address is registered.
        mapping(address => bool) registered;
        // A mapping to ensure a registered user only claims once.
        mapping(address => bool) claimed;
    }
}

#[public]
impl PrizeDistributor {
    /// Initializes the contract, setting the owner and default state.
    pub fn init(&mut self) -> Result<(), Vec<u8>> {
        self.owner.set(msg::sender());
        self.registration_closed.set(false);
        self.registered_count.set(U256::from(0));
        Ok(())
    }
    //0x7e32b54800705876d3b5cfbc7d9c226a211f7c1a

    /// A payable function for users to register.
    /// Calling this function with a nonzero value registers the caller.
    #[payable]
    pub fn bet(&mut self) -> Result<(), Vec<u8>> {
        // Disallow new registrations once registration is closed.
        if self.registration_closed.get() {
            return Err("Registration is closed".as_bytes().to_vec());
        }
        // Ensure the caller sends some amount.
        if msg::value() == U256::from(0) {
            return Err("You must send some amount to register".as_bytes().to_vec());
        }
        // Check if the caller is already registered.
        if self.registered.get(msg::sender()) {
            return Err("Already registered".as_bytes().to_vec());
        }
        // Mark the caller as registered.
        self.registered.insert(msg::sender(), true);
        // Increment the registered count.
        let current_count = self.registered_count.get();
        self.registered_count.set(current_count + U256::from(1));
        Ok(())
    }

    /// Allows the contract owner to close the registration phase.
    pub fn closeRegistration(&mut self) -> Result<(), Vec<u8>> {
        // console!("msg.sender is {}", msg::sender());
        // console!("owner is {}", self.owner.get());
        // if msg::sender() != self.owner.get() {
        //     return Err("Not owner".as_bytes().to_vec());
        // }
        // if self.registration_closed.get() {
        //     return Err("Registration already closed".as_bytes().to_vec());
        // }
        self.registration_closed.set(true);
        Ok(())
    }

    /// Allows a registered user to claim their prize.
    /// The prize is computed as (contract balance / registered count).
    pub fn claimPrize(&mut self) -> Result<(), Vec<u8>> {
        // Ensure registration has been closed.
        if !self.registration_closed.get() {
            return Err("Registration is not closed yet".as_bytes().to_vec());
        }
        let sender = msg::sender();
        // Check that the caller is registered.
        if !self.registered.get(sender) {
            return Err("You are not registered".as_bytes().to_vec());
        }
        // Ensure the caller hasn't claimed already.
        if self.claimed.get(sender) {
            return Err("Prize already claimed".as_bytes().to_vec());
        }
        // Retrieve the contract's total balance.
        let total_balance = contract::balance();
        let count = self.registered_count.get();
        if count == U256::from(0) {
            return Err("No registered users".as_bytes().to_vec());
        }
        // Compute the equal share for each user.
        let share = total_balance / count;
        // Mark the caller as having claimed.
        self.claimed.insert(sender, true);
        // Transfer the share to the caller.
        transfer_eth(sender, share)?;
        Ok(())
    }
}
