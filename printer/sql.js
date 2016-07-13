module.exports = class PrinterSQL {

    constructor({
        name ,
    }) {
        this._name = name;
    }

    name() {
        return this._name;
    }

    serialize({ table }) {
        var fields = table.fields().filter( field => !/^_/.test( field ) );
        var columnNames = fields.map( field => '`' + field + '`' );

        var commands = table.rows().map( row => {
            var values = fields.map( field => JSON.stringify( row[ field ] ) ).join( ',' );
            return `INSERT INTO ${this.name()} (${columnNames}) VALUES( ${values} );`;
        } );

        return commands.join( '\n' );
    }

};