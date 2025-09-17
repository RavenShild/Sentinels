const mysql = require("mysql");

const dbConfig = ({
  database: "sisregex",
  host: "localhost",
  user: "root",
  password: "xxxx"
});

const connection = mysql.createPool(dbConfig);

module.exports = connection;
