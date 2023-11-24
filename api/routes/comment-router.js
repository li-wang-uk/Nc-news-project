const { deleteCommentById, patchVotesByCommentId } = require('../controllers/comments-controllers');

const commentRouter = require('express').Router();

commentRouter.delete('/:comment_id',deleteCommentById)
commentRouter.patch('/:comment_id',patchVotesByCommentId)
module.exports = commentRouter