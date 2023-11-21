const db = require("../../db/connection");


exports.selectTopics = () => {
    const queryString = `SELECT * from topics ;`
    return db.query(queryString).then((result) => {
        return result.rows
    })
}


exports.selectArticlesById = (article_id) => {
    let queryString = `
    SELECT * FROM articles 
    WHERE article_id = $1;
    `
    return db
    .query(queryString, [article_id])
    .then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article Not Found" });
        }
        return result.rows
    })
  }

