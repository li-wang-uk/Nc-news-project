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
    

  it("PATCH 200 when the vote of the selected artictle can be incremented without changing rest properties of the article", () => {
            const updatedVote =  {
              inc_votes:1
              }
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
            .patch('/api/articles/1')
            .send(updatedVote)
            .expect(200)
            .then(({body}) => {
              const selectedArticle = body.articles
              expect(selectedArticle.votes).toBe(101)
              expect(selectedArticle.author).toBe(articleOneCopy.author)
              expect(selectedArticle.comment_count).toBe(articleOneCopy.comment_count)
              expect(selectedArticle.title).toBe(articleOneCopy.title)
              expect(selectedArticle.article_id).toBe(articleOneCopy.article_id)
              expect(selectedArticle.topic).toBe(articleOneCopy.topic)
              expect(selectedArticle.created_at).toBe(articleOneCopy.created_at)
              expect(selectedArticle.article_img_url).toBe(articleOneCopy.article_img_url)
            })
          }) 

it("PATCH 200 when the vote of the selected artictle can be decremented without changing rest properties of the article", () => {
            const updatedVote =  {
              inc_votes:-1
              }
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
            .patch('/api/articles/1')
            .send(updatedVote)
            .expect(200)
            .then(({body}) => {
              const selectedArticle = body.articles
              expect(selectedArticle.votes).toBe(99)
              expect(selectedArticle.author).toBe(articleOneCopy.author)
              expect(selectedArticle.comment_count).toBe(articleOneCopy.comment_count)
              expect(selectedArticle.title).toBe(articleOneCopy.title)
              expect(selectedArticle.article_id).toBe(articleOneCopy.article_id)
              expect(selectedArticle.topic).toBe(articleOneCopy.topic)
              expect(selectedArticle.created_at).toBe(articleOneCopy.created_at)
              expect(selectedArticle.article_img_url).toBe(articleOneCopy.article_img_url)
            })
          })


  it("PATCH 400 when decrement a 0-vote article", () => {
            const updatedVote =  {
              inc_votes:-1
              }
            return request(app)
            .patch('/api/articles/9')
            .send(updatedVote)
            .expect(400)
            .then(({body}) => {
              expect(body.msg).toBe("Bad Request");
            }) 
      })

    it("PATCH 400 when given vote is not in correct format", () => {
        const updatedVote =  {
          inc_votes:"test"
          }
        return request(app)
        .patch('/api/articles/9')
        .send(updatedVote)
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request");
        }) 
      })

  it("PATCH 400 when given article_id in URL is not in right format (number) ", () => {
        const updatedVote =  {
          inc_votes:-1
          }
        return request(app)
        .patch('/api/articles/XX')
        .send(updatedVote)
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad Request");
        }) 
      })

  it("PATCH 404 when given article_id is not found in database", () => {
  const updatedVote =  {
    inc_votes:-1
    }
  return request(app)
  .patch('/api/articles/10101')
  .send(updatedVote)
  .expect(404)
  .then(({body}) => {
  expect(body.msg).toBe("Article Not Found");
  }) 
})

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
            expect(body.comments.length).toBe(2)
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
            expect(body.comments.length).toBe(0)
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

    it("POST 201 when inserts a new comment for an available selected article", () => {
        const newComment =  {
            body: "Testing Comments",
            author: "lurker"
          }
        return request(app)
        .post('/api/articles/9/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(response.body.comment.body).toBe("Testing Comments")
            expect(response.body.comment.author).toBe("lurker")
            expect(response.body.comment.comment_id).toBe(19)
        })
})

    it("POST 404 when inserting comment to a non-exist article which violate the foreign key reference rules", () => {
    const newComment =  {
    body: "Testing Comments",
    author: "lurker"
  }
    return request(app)
      .post("/api/articles/10001/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
})

it("POST 404 when inserting comment to a non-exist user which violate the foreign key reference rules", () => {
  const newComment =  {
  body: "Testing Comments",
  author: "lur"
}
  return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Resource Not Found");
    });
})

    it("POST 400 when given article_id has a bad name to post comment", () => {
    const newComment =  {
    body: "Testing Comments",
    author: "lurker"
  }
    return request(app)
      .post("/api/articles/XX/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
})

    it("POST 400 when comment missing required elements", () => {
    const newComment =  {
    body: "Testing Comments"
  }
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
})
})


describe("/api/comments/:comment_id", ()=> {
  it("DELETE 204 when a selected comment deleted with a valid comment_id and sends no body back", () => {
      return request(app)
      .delete("/api/comments/10")
      .expect(204)
  })

  it('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
  return request(app)
    .delete('/api/comments/999')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Comment Not Found');
    })
})
  it('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
  return request(app)
    .delete('/api/comments/banana')
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad Request');
    })
})

})