const {selectTopics, selectArticlesById} = require("../models/topics-models")
const allEndPoints = require("../../endpoints.json")

exports.getTopics = (req,res,next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}

exports.getEndpoints = (req,res) => {
    res.status(200).send({allEndPoints})
}


exports.getArticlesById = (req,res,next) =>{
    const {article_id} = req.params;
    selectArticlesById(article_id)
    .then((articles) => {
        res.status(200).send({articles})
    })

    .catch((err)=> {
        next(err)
    })
  }


