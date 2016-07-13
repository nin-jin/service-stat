'use strict';

var CollationSimple = require( './collation/simple' );

module.exports = class Table {

    constructor({
        rows = [] ,
        collation = new CollationSimple({ field : 'id' }) ,
    }) {
        this._rows = rows.slice();
        this._collation = collation;
    }

    rows() {
        return this._rows;
    }

    fields() {
        return Object.keys( this.rows()[ 0 ] || {} );
    }

    collation() {
        return this._collation;
    }

    ordered({
        collation = this.collation ,
    }) {
        var rows = this.rows().slice();
        rows.sort( ( A , B )=> collation.compare( A , B ) );
        return new Table({ rows });
    }
    
    grouped({ field }) {
        var dict = {};

        this.rows().forEach( row => {
            var key = row[ field ];
            dict[ key ] = dict[ key ] || { [field] : key , _rows : [] };
            dict[ key ]._rows.push( row );
        } );

        var rows = Object.keys( dict ).map( key => dict[ key ] );

        return new Table({ rows });
    }
    
    projected({ fields }) {
        var rows = this.rows().map( row => {
            var res = {};

            fields.forEach(field => {
                var chunks = /^(\w+)!(.*)$/.exec( field );
                if( chunks ) {
                    switch( chunks[1] ) {
                        case 'first' :
                            if( row._rows && row._rows.length ) {
                                res[field] = row._rows[0][chunks[2]];
                            }
                            break;
                        case 'last' :
                            if( row._rows && row._rows.length ) {
                                res[field] = row._rows[row._rows.length - 1][chunks[2]];
                            }
                            break;
                        case 'sum' :
                            res[field] = row._rows && row._rows.reduce((sum, row)=> sum + ( row[chunks[2]] || 0 ), 0);
                            break;
                        case 'count' :
                            var stat = {}
                            if( row._rows ) {
                                row._rows.forEach( row => stat[ row[ chunks[2] ] ] = true );
                            }
                            res[field] = Object.keys( stat ).length;
                            break;
                        default :
                            throw new Error( `Unknown function ${chunks[1]}` )
                    }
                } else {
                    res[field] = row[field];
                }
            });

            return res;
        } );
        return new Table({ rows });
    }

    top({ count }) {
        return new Table({
            rows : this.rows().slice( 0 , count )
        })
    }
    
};

