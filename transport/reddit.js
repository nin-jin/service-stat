'use strict';

var TransportCommon = require( './common' );

module.exports = class TransportReddit extends TransportCommon {
    
    fetchJSON() {
        return super.fetchJSON().data.children.map( ({ data })=> data );
    }
    
};