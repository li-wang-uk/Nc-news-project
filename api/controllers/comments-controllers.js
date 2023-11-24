const { removeCommentById, checkCommentsIdExists, insertCommentVote,checkCommentVotesBelowZero } = require("../models/comments-models");

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;


    Promise.all([removeCommentById(comment_id),checkCommentsIdExists(comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch(next)
  };




exports.patchVotesByCommentId = (req, res, next) => {
    const {comment_id} = req.params;
    const updatedVote = req.body;
    const patchVotesPromises = [insertCommentVote(comment_id, updatedVote)];
    if (comment_id){
        patchVotesPromises.push(checkCommentsIdExists(comment_id))
        patchVotesPromises.push(checkCommentVotesBelowZero(comment_id,updatedVote))
    }
    Promise.all(patchVotesPromises)
    .then((resolvedComments) => {
        const comments = resolvedComments[0]
        res.status(200).send({comments})
    })
    .catch((err)=> {
        next(err)
    })
}