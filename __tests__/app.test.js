const app = require("../api/app");
const request = require("supertest");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data")
const endpoints = require("../endpoints.json")
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
require("jest-sorted")

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe( "/api/topics", ()=> {
    it("GET 200 sends an array of topics to the client", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic)=> {
                expect(typeof topic.description).toBe("string")
                expect(typeof topic.slug).toBe("string")
            })
        })
    })
    it("GET 404 when an endpoint does not exist", () => {
        return request(app)
        .get("/api/banana")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("path not found")
            })
        })
    })


describe( "/api/", ()=> {
    it("GET 200 sends an object of all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
            expect(body.allEndPoints).toEqual(endpoints)
            })
        })
})

describe( "/api/articles/:article_id", ()=> {
    it("GET 200 sends the client an array of selected article with its properties by given an available article_id ", () => {
        const articleOneCopy =    {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T21:11:00.000Z',
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
          }
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(1);
            const selectedArticle = body.articles[0];
            expect(selectedArticle).toEqual(articleOneCopy)
            })
        })

        
    it("GET 400 when given article_id in URL is not in right format (number)", () => {
            return request(app)
              .get("/api/articles/XX")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
          });

    it("GET 404 when given article_id is not found in database", () => {
            return request(app)
              .get("/api/articles/10101")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("Article Not Found");
              });
          });
    
})
    

describe( "/api/articles", ()=> {
    it("GET 200 sends all articles from test data in an array in descending order with their properties (apart from body)", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy("created_at", {descending: true});
            expect(body.articles).toHaveLength(13);
            body.articles.forEach((article)=> {
            expect(typeof article.author).toBe("string")
            expect(typeof article.title).toBe("string")
            expect(typeof article.article_id).toBe("number")
            expect(typeof article.topic).toBe("string")
            expect(typeof article.created_at).toBe("string")
            expect(typeof article.votes).toBe("number")
            expect(typeof article.article_img_url).toBe("string")
            expect(typeof article.comment_count).toBe("number")
            expect(article).not.toHaveProperty("body")
            })
        })
    })
})

describe( "/api/articles/:article_id/comments", ()=> {
    it("GET 200 sends all available comments with properties for the given article_id, and most recent comments served first", () => {
        
        return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeSortedBy("created_at", {descending: true});
            body.comments.forEach((comment)=> {
                expect(typeof comment.author).toBe("string")
                expect(typeof comment.votes).toBe("number")
                expect(typeof comment.article_id).toBe("number")
                expect(typeof comment.votes).toBe("number")
                expect(typeof comment.created_at).toBe("string")
                expect(typeof comment.comment_id).toBe("number")
            })
        })
    })
    it("GET 400 when given article_id in URL is not in right format (number)", () => {
        return request(app)
          .get("/api/articles/XX/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      
      it("GET 200 when given article_id has no comments ", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toEqual([])
          });
      });
      it("GET 404 when given article_id is not found", () => {
        return request(app)
          .get("/api/articles/20000/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article Not Found");
          });
    })



})