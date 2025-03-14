const mysql = require("mysql");

const dbConfig = ({
  database: "sisregex",
  host: "localhost",
  user: "root",
  password: "R4v3nSh1ldm0n@4l1st@rm7!goIMP@!!!"
});

const connection = mysql.createPool(dbConfig);

module.exports = connection;