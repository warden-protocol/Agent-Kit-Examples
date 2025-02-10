'use strict';
module.exports = class CustomResponse {
    /**
     * @type {any}
     */
    data
    error = false
    message = null
    /**
     * @param {any} data 
     */
    constructor(data, message) {
        this.data = data
        this.message = message
    }
}