const express = require("express");
const { getTopics, getEndpoints} = require("./controllers/topics-controllers");
const { handleFourZeroFour, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");
const { getArticlesById, getAllArticles } = require("./controllers/articles-controllers");
const app = express();
app.get("/api/topics",getTopics)
app.get("/api",getEndpoints)
app.get("/api/articles/:article_id",getArticlesById)
app.get("/api/articles",getAllArticles)
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("*",handleFourZeroFour)


module.exports = app; 