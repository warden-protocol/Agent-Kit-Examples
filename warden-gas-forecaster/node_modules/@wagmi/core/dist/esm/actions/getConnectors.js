import { deepEqual } from '../utils/deepEqual.js';
let previousConnectors = [];
/** https://wagmi.sh/core/api/actions/getConnectors */
export function getConnectors(config) {
    const connectors = config.connectors;
    if (deepEqual(previousConnectors, connectors))
        return previousConnectors;
    previousConnectors = connectors;
    return connectors;
}
//# sourceMappingURL=getConnectors.js.map