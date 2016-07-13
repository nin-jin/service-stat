'use strict';

var TransportCommon = require( '../transport' );

module.exports = class TransportGitHub extends TransportCommon {
    
    fetchJSON() {
        return super.fetchJSON().items;
    }
    
};