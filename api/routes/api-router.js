const { getEndpoints } = require('../controllers/topics-controllers');

const apiRouter = require('express').Router();

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;