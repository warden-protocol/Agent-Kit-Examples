# @ecies/ciphers

[![License](https://img.shields.io/github/license/ecies/js-ciphers.svg)](https://github.com/ecies/js-ciphers)
[![NPM Package](https://img.shields.io/npm/v/@ecies/ciphers.svg)](https://www.npmjs.com/package/@ecies/ciphers)
![NPM Downloads](https://img.shields.io/npm/dm/@ecies/ciphers)
[![Install size](https://packagephobia.com/badge?p=@ecies/ciphers)](https://packagephobia.com/result?p=@ecies/ciphers)
[![CI](https://img.shields.io/github/actions/workflow/status/ecies/js-ciphers/ci.yml)](https://github.com/ecies/js-ciphers/actions)
[![Codecov](https://img.shields.io/codecov/c/github/ecies/js-ciphers.svg)](https://codecov.io/gh/ecies/js-ciphers)

Node/Pure JavaScript symmetric ciphers adapter.

On browsers (or React Native, deno), it'll use [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers)'s implementation for compatibility.

On node (or bun), it'll use [`node:crypto`](https://nodejs.org/api/crypto.html#cryptocreatecipherivalgorithm-key-iv-options)'s implementation for efficiency.

> [!NOTE]
> You may need to polyfill [`crypto.getRandomValues`](https://github.com/LinusU/react-native-get-random-values) for React Native.
>
> There are some limitations, see [Known limitations](#known-limitations) below.
>
> This library is tree-shakeable, unused code will be excluded by bundlers.

Check the [example](./example/) folder for bun/deno usage.

## Quick start

```js
import { aes256gcm } from "@ecies/ciphers/aes";
import { randomBytes } from "@noble/ciphers/webcrypto";

const TEXT = "hello world🌍!";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const msg = encoder.encode(TEXT);

const key = randomBytes();
const nonce = randomBytes(16);
const cipher = aes256gcm(key, nonce);
console.log("decrypted:", decoder.decode(cipher.decrypt(cipher.encrypt(msg))));
```

The API follows `@noble/ciphers`'s API for ease of use, you can check their [examples](https://github.com/paulmillr/noble-ciphers#examples) as well.

## Supported ciphers

- `aes-256-gcm`
  - Both 16 bytes and 12 bytes nonce are supported.
- `aes-256-cbc`
  - **Only for legacy applications**. You should use `xchacha20-poly1305` or `aes-256-gcm` as possible.
  - Nonce is always 16 bytes.
- `chacha20-poly1305`
  - Nonce is always 12 bytes.
- `xchacha20-poly1305`
  - Nonce is always 24 bytes.

If key is fixed and nonce is less than 16 bytes, avoid randomly generated nonce.

## Known limitations

- `xchacha20-poly1305` is implemented with pure JS [`hchacha20`](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha#section-2.2) function and `node:crypto`'s `chacha20-poly1305` on node.
- Currently (Nov 2024), `node:crypto`'s `chacha20-poly1305` is not supported on deno and [bun](https://github.com/oven-sh/bun/issues/8072), `@noble/ciphers`'s implementation is used on both platforms instead.
- `deno` does not support **indirect** conditional exports. If you use this library to build another library, client code of your library probably falls back to the `node:crypto` implementation and may not work properly, specifically `aes-256-gcm` (16 bytes nonce) and `chacha20-poly1305`.
