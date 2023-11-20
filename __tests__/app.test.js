const app = require("../api/app");
const request = require("supertest");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data")
const endpoints = require("../endpoints.json")
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe( "/api/topics", ()=> {
    it("GET 200 sends an array of topic objects", () => {
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
    it("GET 200 sends the selected article by given article_id", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(1);
            const selectedArticle = body.articles[0];
            expect(typeof selectedArticle.article_id).toBe("number")
            expect(typeof selectedArticle.author).toBe("string")
            expect(typeof selectedArticle.title).toBe("string")
            expect(typeof selectedArticle.article_id).toBe("number")
            expect(typeof selectedArticle.body).toBe("string")
            expect(typeof selectedArticle.created_at).toBe("string")
            expect(typeof selectedArticle.votes).toBe("number")
            expect(typeof selectedArticle.article_img_url).toBe("string")
            })
        })

        
    it("GET 400 when given article_id is not a number", () => {
            return request(app)
              .get("/api/articles/XX")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
          });

    it("GET 404 when given article_id is not found", () => {
            return request(app)
              .get("/api/articles/10101010101")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("Article Not Found");
              });
          });
    
})
    