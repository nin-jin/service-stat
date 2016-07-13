'use strict';

var Future = require( 'fibers/future' );

var App = require( './app' );

Future.task( ()=> {
    
    var app = new App({
        argv : process.argv.slice(2) ,
    });

    app.run();

} ).detach();
