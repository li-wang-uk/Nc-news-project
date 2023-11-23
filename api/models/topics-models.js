const db = require("../../db/connection");


exports.selectTopics = () => {
    const queryString = `SELECT * from topics ;`
    return db.query(queryString).then((result) => {
        return result.rows
    })
}

exports.checkTopicExists = (topic) => {
    return db
    .query(`
    SELECT * FROM topics
    WHERE slug = $1;`, [topic])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Topic Not Found'})
        }
    })
  }
  