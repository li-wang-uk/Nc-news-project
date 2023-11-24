const { getAllUsers, getUsersByUsername } = require('../controllers/users-controllers');

const userRouter = require('express').Router();

userRouter.get('/',getAllUsers)
userRouter.get('/:username',getUsersByUsername)
module.exports = userRouter