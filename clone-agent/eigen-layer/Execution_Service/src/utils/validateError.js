'use strict';
module.exports = class CustomError {
    error = true
    /**
     * @type {string}
     */
    message
    /**
     * @type {any}
     */
    data
    /**
     * @param {string} message
     * @param {any} data 
     */
    constructor(message, data) {
        this.data = data
        this.message = message
    }
}