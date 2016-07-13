'use strict';

module.exports = class CollationInverse {

    constructor({ base }) {
        this.base = base;
    }

    compare( A , B ) {
        return - this.base.compare( A , B );
    }

};
