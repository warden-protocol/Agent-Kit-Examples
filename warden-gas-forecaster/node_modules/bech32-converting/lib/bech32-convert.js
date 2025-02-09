const {
    isValidChecksumAddress,
    stripHexPrefix,
    toChecksumAddress
} = require('crypto-addr-codec');
const { bech32 } = require('bech32');

const { encode, decode, toWords, fromWords } = bech32;

function hexEncoder() {
    return (data) => toChecksumAddress(data.toString('hex'));
}

function hexDecoder() {
    return (data) => {
        const stripped = stripHexPrefix(data);

        if (
            !isValidChecksumAddress(data) &&
            stripped !== stripped.toLowerCase() &&
            stripped !== stripped.toUpperCase()
        ) {
            throw Error('Invalid address checksum');
        }

        return Buffer.from(stripHexPrefix(data), 'hex');
    };
}

function bech32Encoder(prefix) {
    return (data) => encode(prefix, toWords(data));
}

function bech32Decoder(currPrefix) {
    return (data) => {
        const { prefix, words } = decode(data);

        if (prefix !== currPrefix) {
            throw Error('Invalid address format');
        }

        return Buffer.from(fromWords(words));
    }
}

function hexConverter() {
    return {
        decoder: hexDecoder(),
        encoder: hexEncoder(),
    }
}

function bech32Convert(prefix) {
    return {
        decoder: bech32Decoder(prefix),
        encoder: bech32Encoder(prefix),
    }
}

function converter(prefix) {
    return {
        toHex: (address) => hexConverter().encoder(bech32Convert(prefix).decoder(address)),
        toBech32: (address) => bech32Convert(prefix).encoder(hexConverter().decoder(address))
    }
}

module.exports = converter;
