const mysql = require("mysql");

const dbConfig = ({
  database: "sisregex",
  host: "localhost",
  user: "root",
  password: "senha_db"
});

const connection = mysql.createPool(dbConfig);

module.exports = connection;