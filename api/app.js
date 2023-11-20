const express = require("express");
const { getTopics, getEndpoints, getArticlesById } = require("./controllers/topics-controllers");
const { handleFourZeroFour, handleCustomErrors } = require("./errors");
const app = express();
app.get("/api/topics",getTopics)
app.get("/api",getEndpoints)
app.get("/api/articles/:article_id",getArticlesById)
app.use(handleCustomErrors);
app.all("*",handleFourZeroFour)


module.exports = app; 