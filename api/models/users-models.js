const db = require("../../db/connection");

exports.selectAllUsers = () => {
    const queryString = `SELECT * FROM users ;`
    return db.query(queryString).then((result) => {
        return result.rows
    })
  }