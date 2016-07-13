'use strict';

module.exports = class CollationSimple {

    constructor({ field }) {
        this.field = field;
    }

    compare( A , B ) {
        var a = A[ this.field ];
        var b = B[ this.field ];

        if( a > b ) return 1;
        if( a < b ) return -1;

        return 0;
    }

};