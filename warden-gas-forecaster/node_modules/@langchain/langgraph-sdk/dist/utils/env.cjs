"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentVariable = void 0;
function getEnvironmentVariable(name) {
    // Certain setups (Deno, frontend) will throw an error if you try to access environment variables
    try {
        return typeof process !== "undefined"
            ? // eslint-disable-next-line no-process-env
                process.env?.[name]
            : undefined;
    }
    catch (e) {
        return undefined;
    }
}
exports.getEnvironmentVariable = getEnvironmentVariable;
