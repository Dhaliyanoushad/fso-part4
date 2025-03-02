const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((result) => {
    response.json(result);
  });
});

blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogsRouter.delete("/:id", async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);

  if (!deletedBlog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  response.status(204).end();
});

blogsRouter.post("/", (request, response, next) => {
  const body = request.body;

  if (!body.title || !body.url || !body.author) {
    return response.status(400).json({ error: "Title, URL or Author missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  blog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog);
    })
    .catch((error) => next(error));
});

// New PUT endpoint to handle updates
blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !author) {
    return response.status(400).json({ error: "Title or Author missing" });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" }
  );

  if (!updatedBlog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  response.json(updatedBlog);
});

module.exports = blogsRouter;
