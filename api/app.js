const express = require("express");
const { handleFourZeroFour, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require("./errors");
const apiRouter = require("./routes/api-router");
const topicRouter = require("./routes/topic-router");
const articleRouter = require("./routes/article-router");
const commentRouter = require("./routes/comment-router");
const userRouter = require("./routes/user-router");
const app = express();
app.use(express.json())
app.use("/api/topics", topicRouter)
app.use("/api",apiRouter)
app.use("/api/articles",articleRouter)
app.use("/api/comments", commentRouter)
app.use("/api/users",userRouter)
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.all("*",handleFourZeroFour)


module.exports = app; 