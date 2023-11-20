const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/topics-controllers");
const { handleFourZeroFour } = require("./errors");
const app = express();
app.get("/api/topics",getTopics)
app.get("/api",getEndpoints)
app.all("*",handleFourZeroFour)


module.exports = app; 