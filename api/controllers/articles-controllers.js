const { selectArticlesById, selectAllArticles, selectCommentsByArticleId, checkArticleIdExists, insertComment } = require("../models/articles-models");

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

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params;
    const commentsByAriticleIdPromises = [selectCommentsByArticleId(article_id)];

    if (article_id) {
        commentsByAriticleIdPromises.push(checkArticleIdExists(article_id));
    }

    Promise.all(commentsByAriticleIdPromises)
    .then((resolvedComments) => {
        const comments = resolvedComments[0]
        res.status(200).send({comments})
    })
    .catch((err)=> {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    const newComment = req.body;
    const commentsByAriticleIdPromises = [insertComment(article_id, newComment)];



    if (article_id) {
        commentsByAriticleIdPromises.push(checkArticleIdExists(article_id));
    }


    Promise.all(commentsByAriticleIdPromises)
    .then((resolvedComments) => {
        const comment = resolvedComments[0];
        res.status(201).send({ comment });
    })
    .catch((err)=> {
        next(err)
    })
}