const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: '127.0.0.1', 
  port: 3306,
  user: 'root',
  password: '930802',
  database: 'university_db',
  connectionLimit: 5,
  allowPublicKeyRetrieval: true
});

module.exports = pool;
