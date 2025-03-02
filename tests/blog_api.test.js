const { describe, test, beforeEach, after } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Introduction to JavaScript",
    author: "John Doe",
    url: "https://example.com/javascript-intro",
    likes: 10,
  },
  {
    title: "Understanding MongoDB",
    author: "Jane Smith",
    url: "https://example.com/mongodb-guide",
    likes: 25,
  },
];

describe("Blog API tests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blog posts have an 'id' property instead of '_id'", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((blog) => {
      assert(blog.id, "Blog post should have an 'id' property");
      assert(!blog._id, "Blog post should not have an '_id' property");
    });
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "Mastering Async/Await in JavaScript",
      author: "Jane Doe",
      url: "https://example.com/async-await",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const titles = response.body.map((b) => b.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    assert(titles.includes("Mastering Async/Await in JavaScript"));
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
