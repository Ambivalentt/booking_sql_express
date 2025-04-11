const server = require('mysql2');
require('dotenv').config();


const db = server.createConnection({
        host: 'localhost',
        user: 'stack',
        password: process.env.MYSQL_PASSWORD,
        database: 'booking_sql'
    });

module.exports = db;