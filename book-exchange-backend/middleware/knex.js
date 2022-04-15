const pg = require('pg')
pg.types.setTypeParser(20, 'text', parseInt)


const knex = require('knex')
const { parse } = require("pg-connection-string");
const { dbUrl } = require('../config');

//initialize database connection object with parsed db string to prevent bugs occuring in postgres sql server
const db = knex({   
    client: 'pg',
    connection: {
        ...parse(dbUrl)
    }    
});

module.exports = {
    db: db  
}
