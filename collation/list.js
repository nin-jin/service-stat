'use strict';

var CollationSimple = require( './simple' );
var CollationInverse = require( './inverse' );

module.exports = class CollationList {

    constructor({ list , string }) {
        this.list = [];

        if( string ) {
            string.replace( /(.+?)(>|<)/g , ( str , field , coll )=> {
                var collation = new CollationSimple({ field });
                if( coll === '>' ) collation = new CollationInverse({ base : collation });
                this.list.push( collation );
                return str;
            } );
        }

        if( list ) this.list = this.list.concat( list );
    }

    compare( A , B ) {
        var res = 0;
        for( var collation of this.list ) {
            res = collation.compare( A , B );
            if( res !== 0 ) break;
        }
        return res
    }

};
