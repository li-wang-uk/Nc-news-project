const db = require("../../db/connection");
const format = require("pg-format");

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

  exports.selectAllArticles = (topic) => {
    let queryString = `SELECT COUNT(c.comment_id):: INT AS comment_count , a.author, a.title, a.article_id, topic, a.created_at, a.votes, a.article_img_url FROM comments c
    FULL OUTER JOIN articles a 
    ON a.article_id = c.article_id
   `
    if (topic){
      const topicQuery = format(`WHERE topic = %L`, topic ); 
      queryString += topicQuery;
    }
  
    const orderString = `
    GROUP BY a.article_id
    ORDER BY a.created_at DESC ;`
  
    queryString += orderString;
  
    return db
    .query(queryString)
    .then((result) => {
      if (result.rows.length === 0){
        return Promise.reject({ status: 404, msg: "Article Not Found" });
    }
        return result.rows
    })
  }
  
  

exports.checkArticleIdExists = (article_id) => {
    return db
    .query(`
    SELECT * FROM articles
    WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Article Not Found'})
        }
    })
}

exports.selectCommentsByArticleId = (article_id) => {
    const queryString = `
    SELECT * FROM comments
    where article_id = $1
    ORDER BY created_at DESC ;
    `
    return db
    .query(queryString, [article_id])
    .then((result) => {

        return result.rows
    })

}


exports.insertComment = (article_id, { body, author }) => {
    if (!article_id || !body || !author){
      return Promise.reject({status:400,msg: 'Bad request'})
    }
    
    return db
      .query(
        'INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;',
        [body, article_id, author]
      )
      .then((result) => {
        return result.rows[0];
      });
  };

exports.insertVote = (article_id, { inc_votes }) => {
    if (!article_id || !inc_votes ){
        return Promise.reject({status:400,msg: 'Bad request'})
      }
    const queryString = `
    UPDATE articles 
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;
    `
    return db
    .query(queryString, [article_id, inc_votes])
    .then((result) => {
        return result.rows[0]
    })
}

exports.checkVotesBelowZero = (article_id,updatedVote) => {
    return db
    .query(`
    SELECT votes FROM articles
    WHERE article_id = $1;`, [article_id])
    .then(({rows}) => {
        if((rows[0].votes + updatedVote.inc_votes) < 0) {
            return Promise.reject({status: 400, msg: 'Bad Request'})
        }
    })
}