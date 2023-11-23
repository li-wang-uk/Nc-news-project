const { removeCommentById, checkCommentsIdExists } = require("../models/comments-models");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const deleteCommentPromises = [removeCommentById(comment_id)];

    if(comment_id){
      deleteCommentPromises.push(checkCommentsIdExists(comment_id));
    }
    Promise.all(deleteCommentPromises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next)
  };

