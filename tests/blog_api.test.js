const { test, after, beforeEach } = require("node:test");
const assert = require("assert"); // Import assert
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog"); // Corrected model import

const api = supertest(app); // Define api before tests

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

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});
