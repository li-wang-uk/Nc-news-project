const { getAllArticles, getArticlesById, getCommentsByArticleId, postComment, patchVotesByArticleId, postArticles } = require('../controllers/articles-controllers');

const articleRouter = require('express').Router();
articleRouter.get('/', getAllArticles)
articleRouter.get('/:article_id',getArticlesById)
articleRouter.get('/:article_id/comments',getCommentsByArticleId)
articleRouter.post("/:article_id/comments",postComment)
articleRouter.patch("/:article_id", patchVotesByArticleId)
articleRouter.post('/',postArticles)

module.exports = articleRouter