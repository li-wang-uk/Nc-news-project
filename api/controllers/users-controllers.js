const { selectAllUsers, selectUserByUsername } = require("../models/users-models")

exports.getAllUsers = (req,res,next) => {
    selectAllUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}

exports.getUsersByUsername = (req,res,next) => {
    const {username} = req.params;
    selectUserByUsername(username)
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err)=> {
        next(err)
    })

}
