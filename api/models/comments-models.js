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