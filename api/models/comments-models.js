const db = require("../../db/connection");

exports.removeCommentById = (comment_id) => {
    if(!Number(comment_id)){
        return Promise.reject({status:400,msg: 'Bad Request'})
      }
        return db
        .query('DELETE FROM comments WHERE comment_id = $1;', [comment_id]);
        }
    
    
exports.checkCommentsIdExists = (comment_id) => {
            return db
            .query(`
            SELECT * FROM comments
            WHERE comment_id = $1;`, [comment_id])
            .then(({rows}) => {
                if(!rows.length) {
                    return Promise.reject({status: 404, msg: 'Comment Not Found'})
                }
            })
          }

exports.insertCommentVote = (comment_id, { inc_votes }) => {
            if (!comment_id || !inc_votes ){
                return Promise.reject({status:400,msg: 'Bad request'})
              }
            const queryString = `
            UPDATE comments 
            SET votes = votes + $2
            WHERE comment_id = $1
            RETURNING *;
            `
            return db
            .query(queryString, [comment_id, inc_votes])
            .then((result) => {
                return result.rows[0]
            })
          }
          
exports.checkCommentVotesBelowZero = (comment_id,updatedVote) => {
            return db
            .query(`
            SELECT votes FROM comments
            WHERE comment_id = $1;`, [comment_id])
            .then(({rows}) => {
                if((rows[0].votes + updatedVote.inc_votes) < 0) {
                    return Promise.reject({status: 400, msg: 'Bad Request'})
                }
            })
          }
          
