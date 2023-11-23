const express = require("express");
const { getTopics, getEndpoints} = require("./controllers/topics-controllers");
const { handleFourZeroFour, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");
const { getArticlesById, getAllArticles, getCommentsByArticleId, postComment, patchVotesByArticleId } = require("./controllers/articles-controllers");
const { deleteCommentById } = require("./controllers/comments-controllers");
const app = express();
app.use(express.json())
app.get("/api/topics",getTopics)
app.get("/api",getEndpoints)
app.get("/api/articles/:article_id",getArticlesById)
app.get("/api/articles",getAllArticles)
app.get("/api/articles/:article_id/comments",getCommentsByArticleId)
app.post("/api/articles/:article_id/comments",postComment)
app.patch("/api/articles/:article_id",patchVotesByArticleId)
app.delete("/api/comments/:comment_id",deleteCommentById)
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("*",handleFourZeroFour)


module.exports = app; 