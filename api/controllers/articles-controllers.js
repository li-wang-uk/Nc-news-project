const { selectArticlesById, selectAllArticles, selectCommentsByArticleId, checkArticleIdExists, insertComment, insertVote, checkVotesBelowZero } = require("../models/articles-models");
const { checkTopicExists } = require("../models/topics-models");

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
    const {sort_by, order} =req.query;
        if(req.query.topic){
            const { topic} = req.query;
            Promise.all([selectAllArticles(sort_by, order,topic),checkTopicExists(topic)])
            .then((resolvedArticles) => {
                const articles = resolvedArticles[0]
                res.status(200).send({articles})
            })
            .catch((err)=> {
                next(err)
            })
        } else {
            selectAllArticles(sort_by, order)
            .then((articles) => {
                res.status(200).send({articles})
            })
            .catch((err)=> {
                next(err)
            })
        }

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

exports.patchVotesByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const updatedVote = req.body;
    const patchVotesPromises = [insertVote(article_id, updatedVote)];
    if (article_id){
        patchVotesPromises.push(checkArticleIdExists(article_id))
        patchVotesPromises.push(checkVotesBelowZero(article_id,updatedVote))
    }
    Promise.all(patchVotesPromises)
    .then((resolvedArticles) => {
        const articles = resolvedArticles[0]
        res.status(200).send({articles})
    })
    .catch((err)=> {
        next(err)
    })
}