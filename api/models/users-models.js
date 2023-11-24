const db = require("../../db/connection");

exports.selectAllUsers = () => {
    const queryString = `SELECT * FROM users ;`
    return db.query(queryString).then((result) => {
        return result.rows
    })
  }


exports.selectUserByUsername = (username) => {
    const queryString = `
    SELECT * FROM users 
    WHERE username = $1;
    `
  
    return db.query(queryString,[username]).then((result) => {
      if (result.rows.length === 0){
        return Promise.reject({ status: 404, msg: "User Not Found" });
    }
        return result.rows
    })
  }
  