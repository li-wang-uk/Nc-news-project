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
    if(Object.keys(req.query).length !== 0){
        const {topic} = req.query;
        if (topic){
            Promise.all([selectAllArticles(topic),checkTopicExists(topic)])
            .then((resolvedArticles) => {
                const articles = resolvedArticles[0]
                if(articles.length === 0) {
                    return Promise.reject({status: 404, msg: 'Article Not Found'})
                }
                res.status(200).send({articles})
            })
            .catch((err)=> {
                next(err)
            })
        } else {
            return Promise.reject({status: 400, msg: 'Bad Request'})
            .catch((err)=> {
                 next(err)
            })
        }

    }else{
        selectAllArticles()
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