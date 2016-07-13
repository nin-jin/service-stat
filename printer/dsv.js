module.exports = class PrinterDSV {

    constructor({
        separator = ';' ,
    }) {
        this._separator = separator;
    }

    separator() {
        return this._separator;
    }

    serialize({ table }) {
        var fields = table.fields().filter( field => !/^_/.test( field ) );
        
        return table.rows().map( row => {
            var chunks = fields.map( field => JSON.stringify( row[ field ] ) );
            return chunks.join( this.separator() );
        } ).join( '\n' );
    }

};