const { selectArticlesById, selectAllArticles } = require("../models/articles-models");

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


exports.getAllArticles = (req,res,next) => {
    selectAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}