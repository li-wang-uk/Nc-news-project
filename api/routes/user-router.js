const { getAllUsers } = require('../controllers/users-controllers');

const userRouter = require('express').Router();

userRouter.get('/',getAllUsers)
module.exports = userRouter