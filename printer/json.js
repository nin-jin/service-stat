module.exports = class PrinterJSON {

    serialize({ table }) {
        return JSON.stringify( table.rows() , null , '  ' );
    }
    
};