'use strict';

var URL = require( 'url' );
var FS = require( 'fibers/future' ).wrap( require( 'fs' ) );

var DefaultTransport = require( './transport.js' );

var CollationList = require( './collation/list' );

var PrinterJSON = require( './printer/json' );
var PrinterDSV = require( './printer/dsv' );
var PrinterSQL = require( './printer/sql' );

module.exports = class App {

    constructor({ argv , args }) {
        this._argv = argv;
        this._args = args;
    }

    argv() {
        return this._argv;
    }

    args() {
        if( this._args ) return this._args;

        this._args = {};

        this.argv().forEach( arg => {
            var chunks = arg.match( /^(\w+)=(.*)$/ );
            if( chunks ) {
                this._args[ chunks[1] ] = chunks[2];
            } else {
                this._args[ arg ] = true
            }
        } );

        return this._args;
    }

    run() {
        var table = null;

        var printer = new PrinterDSV({});
        var name = 'unnamed_table';

        this.argv().forEach( arg => {
            var chunks = arg.match( /^(\w+)=(.*)$/ );
            var action = chunks ? chunks[1] : arg;
            var value = chunks ? chunks[2] : true;

            switch( action ) {

                case 'source' :
                    var host = URL.parse( value ).host;
                    var path = `./transport/${host}.js`;

                    try {
                        FS.accessFuture( path ).wait();
                        var exists = true;
                    } catch( error ) {
                        var exists = false;
                    }

                    var Transport = exists ? require( path ) : DefaultTransport;
                    var transport = new Transport({ uri : value });

                    table = transport.fetchTable();
                    break;

                case 'order' :
                    table = table.ordered({
                        collation: new CollationList({ string : value }) ,
                    });
                    break;

                case 'group' :
                    table = table.grouped({ field : value });
                    break;

                case 'project' :
                    table = table.projected({
                        fields : value.split( ',' ) ,
                    });
                    break;

                case 'top' :
                    table = table.top({
                        count : Number( value ) ,
                    });
                    break;

                case 'name' :
                    name = value;
                    break;

                case 'format' :
                    switch( value ) {

                        case 'json' :
                            printer = new PrinterJSON;
                            break;

                        case 'csv' :
                        case 'tsv' :
                        case 'ssv' :
                            var separators = {
                                csv : ',' ,
                                tsv : '\t' ,
                                ssv : ';' ,
                            };

                            printer = new PrinterDSV({
                                separator : separators[ value ] ,
                            });

                            break;

                        case 'sql' :
                            printer = new PrinterSQL({ name });
                            break;

                        default :
                            throw new Error( `Unknown format ${value}` );
                    }
                    break;

                default :
                    throw new Error( `Unknown action ${action}` );

            }
        } );

        console.log( printer.serialize({ table }) );
    }

};
