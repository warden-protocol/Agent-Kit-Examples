export function getClient(config, parameters = {}) {
    let client = undefined;
    try {
        client = config.getClient(parameters);
    }
    catch { }
    return client;
}
//# sourceMappingURL=getClient.js.map