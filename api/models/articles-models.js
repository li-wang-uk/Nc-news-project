const db = require("../../db/connection");
const format = require("pg-format");

exports.selectArticlesById = (article_id) => {
    let queryString = `
    SELECT  COUNT(c.comment_id):: INT AS comment_count, a.* FROM comments c
    LEFT JOIN articles a 
    ON a.article_id = c.article_id
    WHERE a.article_id = $1 
    GROUP BY a.article_id ;
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

  exports.selectAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    let queryString = `SELECT COUNT(c.comment_id):: INT AS comment_count , a.author, a.title, a.article_id, topic, a.created_at, a.votes, a.article_img_url FROM comments c
    FULL OUTER JOIN articles a 
    ON a.article_id = c.article_id`
    if(sort_by===''){
      sort_by = 'created_at'
    }
    if(order===''){
      order = 'desc'
    }
   const orderValues = ['asc','desc']
   const  sortByValues = ['author','title','article_id','topic','created_at','votes','article_img_url','comment_count']
 
   if (sortByValues.includes(sort_by.toLowerCase()) === false) {

    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (orderValues.includes(order.toLowerCase()) === false) {

    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  
    if (topic){
      const topicQuery = format(`
      WHERE topic = %L`, topic ); 
      queryString += topicQuery;
    }
  
    queryString += `
    GROUP BY a.article_id
    ORDER BY a.${sort_by} ${order}
    ; 
    `

    return db
    .query(queryString)
    .then((result) => {
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

exports.insertArticles = ({author, title, body, topic, article_img_url = 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'}) => {
  const queryString = `
  INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5)
  RETURNING * ;
  `

  return db
  .query(
      queryString, [author,title,body,topic,article_img_url]
  )
  .then((result) => {
      return result.rows[0]
  })
}

