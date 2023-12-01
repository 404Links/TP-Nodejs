const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("tester CRUD articles", () => {
  let token;
  const USER_ID = "fake";
  const MOCK_DATA = [
    {
      _id: USER_ID,
      name: "ana",
      email: "nfegeg@gmail.com",
      password: "azertyuiop",
      role:'admin'
    },
  ];
  const MOCK_DATA_CREATED = {
    title: "Un faux article",
    content: "Un faux contenu",
    user: MOCK_DATA._id,
    status: "published",
  };
  const MOCK_DATA_UPDATED = {
    title: "Un autre titre",
    content: "Un nouveau contenu",
    user: MOCK_DATA._id,
    status: "draft",
  }; 

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_DATA, "find");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Articles] Creation", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    console.log(res.body)
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] MaJ", async () => {

    const article = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    console.log(article.body._id);
    const res = await request(app)
      .put(`/api/articles/${article.body._id}`)
      .send(MOCK_DATA_UPDATED)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
  });

  test("[Articles] Suppression", async () => {
    const article = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    
    const res = await request(app)
      .delete(`/api/articles/${article.body._id}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);

    const resget = await request(app)
      .get(`/api/articles/${article.body._id}`)
      .set("x-access-token", token);
    expect(resget.status).toBe(500);
  });
});