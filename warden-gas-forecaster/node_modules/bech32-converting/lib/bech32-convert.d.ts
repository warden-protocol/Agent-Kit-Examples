declare module 'bech32-converting' {
    export = converter;
    function converter(prefix: string): {
        toHex: (address: string) => string;
        toBech32: (address: string) => string;
    };
}
