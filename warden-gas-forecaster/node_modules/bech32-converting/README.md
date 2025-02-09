# bech32-converting

This library is designed to convert bech32 addresses to hex and vice versa.

You can use any prefix and address, it will match bech32 address on blockchain node.

## Installation

```bash
npm install bech32-converting
```

## Usage
```javascript
import converter from "bech32-converting"

converter('prefix').toHex('address')
converter('prefix').toBech32('address')

// Example

converter('eth').toBech32('0xf9e0bd5927557a39e246f88774e6b209389731db')
// eth1l8st6kf824arncjxlzrhfe4jpyufwvwm5f5cyp

converter('eth').toHex('eth1l8st6kf824arncjxlzrhfe4jpyufwvwm5f5cyp')
// 0xf9e0bd5927557a39e246f88774e6b209389731db
```
