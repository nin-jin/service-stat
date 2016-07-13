'use strict';

var TransportCommon = require( '../transport' );

module.exports = class TransportVK extends TransportCommon {
    
    fetchJSON() {
        return super.fetchJSON().response;
    }
    
};