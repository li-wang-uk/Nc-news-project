const app = require("../api/app");
const request = require("supertest");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data")
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
})