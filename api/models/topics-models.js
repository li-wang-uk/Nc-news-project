const db = require("../../db/connection");


exports.selectTopics = () => {
    const queryString = `SELECT * from topics ;`
    return db.query(queryString).then((result) => {
        return result.rows
    })
}