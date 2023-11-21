const db = require("../../db/connection");

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

  exports.selectAllArticles = () => {
    const queryString = `SELECT COUNT(c.comment_id) AS comment_count, a.author, a.title, a.article_id, topic, a.created_at, a.votes, a.article_img_url FROM comments c
    FULL OUTER JOIN articles a 
    ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC ;`
    return db.query(queryString).then((result) => {
        return result.rows
    })
}