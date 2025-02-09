import { SCWSigner } from './scw/SCWSigner.js';
import { WalletLinkSigner } from './walletlink/WalletLinkSigner.js';
import { ScopedLocalStorage } from '../core/storage/ScopedLocalStorage.js';
const SIGNER_TYPE_KEY = 'SignerType';
const storage = new ScopedLocalStorage('CBWSDK', 'SignerConfigurator');
export function loadSignerType() {
    return storage.getItem(SIGNER_TYPE_KEY);
}
export function storeSignerType(signerType) {
    storage.setItem(SIGNER_TYPE_KEY, signerType);
}
export async function fetchSignerType(params) {
    const { communicator, metadata, handshakeRequest, callback } = params;
    listenForWalletLinkSessionRequest(communicator, metadata, callback).catch(() => { });
    const request = {
        id: crypto.randomUUID(),
        event: 'selectSignerType',
        data: Object.assign(Object.assign({}, params.preference), { handshakeRequest }),
    };
    const { data } = await communicator.postRequestAndWaitForResponse(request);
    return data;
}
export function createSigner(params) {
    const { signerType, metadata, communicator, callback } = params;
    switch (signerType) {
        case 'scw': {
            return new SCWSigner({
                metadata,
                callback,
                communicator,
            });
        }
        case 'walletlink': {
            return new WalletLinkSigner({
                metadata,
                callback,
            });
        }
    }
}
async function listenForWalletLinkSessionRequest(communicator, metadata, callback) {
    await communicator.onMessage(({ event }) => event === 'WalletLinkSessionRequest');
    // temporary walletlink signer instance to handle WalletLinkSessionRequest
    // will revisit this when refactoring the walletlink signer
    const walletlink = new WalletLinkSigner({
        metadata,
        callback,
    });
    // send wallet link session to popup
    communicator.postMessage({
        event: 'WalletLinkUpdate',
        data: { session: walletlink.getSession() },
    });
    // wait for handshake to complete
    await walletlink.handshake();
    // send connected status to popup
    communicator.postMessage({
        event: 'WalletLinkUpdate',
        data: { connected: true },
    });
}
//# sourceMappingURL=util.js.map