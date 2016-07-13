'use strict';

var Future = require( 'fibers/future' );
var Fetch = require( 'fetch-promise' );

var Table = require( './table' );

module.exports = class Transport {

    constructor({ uri }) {
        this.uri = uri
    }

    fetch() {
        return Future.fromPromise( Fetch( this.uri ) ).wait();
    }

    fetchJSON() {
        return JSON.parse( this.fetch().buf );
    }

    fetchTable() {
        return new Table({ rows : this.fetchJSON() });
    }
};