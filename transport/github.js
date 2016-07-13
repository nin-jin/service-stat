'use strict';

var TransportCommon = require( './common' );

module.exports = class TransportGitHub extends TransportCommon {
    
    fetchJSON() {
        return super.fetchJSON().items;
    }
    
};