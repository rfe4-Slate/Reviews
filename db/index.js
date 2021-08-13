const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  port: 5432,
  database: 'postgres'
});


module.exports = pool;

// setup connection to database
// export database
// import database to server file