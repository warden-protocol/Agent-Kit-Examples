// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.25 <0.9.0;

library Types {
    // Sign request data
    struct SignRequestData {
        uint64 keyId;
        bytes[] analyzers;
        bytes encryptionKey;
        uint64 spaceNonce;
        uint64 actionTimeoutHeight;
        string expectedApproveExpression;
        string expectedRejectExpression;
    }

    enum PriceCondition {
        LTE,
        GTE,
        LT,
        GT
    }

    // Data for basic order creation
    struct BasicOrderData {
        uint256 thresholdPrice;
        PriceCondition priceCondition;
        PricePair pricePair;
    }

    // Data for advanced order creation
    struct AdvancedOrderData {
        // Which pair use to get price for oracle
        PricePair oraclePricePair;
        // Which pair use to get price for prediction handler
        PricePair predictPricePair;
        // Price condition for execution: should be executing if current price meets condition to prediced price
        PriceCondition priceCondition;
        // seconds timestamp
        uint256 pricePredictDate;
    }

    // Data for execution
    struct CommonExecutionData {
        CreatorDefinedTxFields creatorDefinedTxFields;
        SignRequestData signRequestData;
    }

    // Price pair for oracle/prediction requests
    struct PricePair {
        string base;
        string quote;
    }

    struct CreatorDefinedTxFields {
        uint256 value;
        uint256 chainId;
        address to;
        bytes data;
    }

    struct AnyType {
        string typeUrl;
        bytes value;
    }

    struct Timestamp {
        uint64 secs;
        uint64 nanos;
    }

    /// @dev Dec represents a fixed point decimal value. The value is stored as an integer, and the
    /// precision is stored as a uint8. The value is multiplied by 10^precision to get the actual value.
    struct Dec {
        uint256 value;
        uint8 precision;
    }

    /// @dev Coin is a struct that represents a token with a denomination and an amount.
    struct Coin {
        string denom;
        uint256 amount;
    }

    /// @dev DecCoin is a struct that represents a token with a denomination, an amount and a precision.
    struct DecCoin {
        string denom;
        uint256 amount;
        uint8 precision;
    }

    /// @dev PageResponse is a struct that represents a page response.
    struct PageResponse {
        bytes nextKey;
        uint64 total;
    }

    /// @dev PageRequest is a struct that represents a page request.
    struct PageRequest {
        bytes key;
        uint64 offset;
        uint64 limit;
        bool countTotal;
        bool reverse;
    }

    /// @dev Height is a monotonically increasing data type
    /// that can be compared against another Height for the purposes of updating and
    /// freezing clients
    ///
    /// Normally the RevisionHeight is incremented at each height while keeping
    /// RevisionNumber the same. However some consensus algorithms may choose to
    /// reset the height in certain conditions e.g. hard forks, state-machine
    /// breaking changes In these cases, the RevisionNumber is incremented so that
    /// height continues to be monotonically increasing even as the RevisionHeight
    /// gets reset
    struct Height {
        // the revision that the client is currently on
        uint64 revisionNumber;
        // the height within the given revision
        uint64 revisionHeight;
    }
}
