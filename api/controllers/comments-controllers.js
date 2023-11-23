const { removeCommentById, checkCommentsIdExists } = require("../models/comments-models");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;


    Promise.all([removeCommentById(comment_id),checkCommentsIdExists(comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next)
  };

