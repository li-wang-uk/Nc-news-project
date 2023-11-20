const app = require("../api/app");
const request = require("supertest");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data")
const allEndPoints = require("../endpoints.json")
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
            const valuesOfAllEndpoints = Object.values(body);
            const allRequests = Object.keys(body);
            valuesOfAllEndpoints.forEach((endpoint) => {
                expect(Object.keys(endpoint)).toEqual([ 'description', 'queries', 'exampleResponse' ])
            })
            expect(allRequests).toEqual([ 'GET /api', 'GET /api/topics', 'GET /api/articles' ])
            expect(body).toEqual(allEndPoints)
            })
        })
    })
