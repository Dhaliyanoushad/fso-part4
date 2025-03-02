const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let favorite = blogs[0];
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i];
    }
  }

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogsWithLodash = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  // Group blogs by author and count them
  const authorCounts = _.countBy(blogs, "author");

  // Find author with most blogs
  const topAuthor = _.maxBy(
    Object.keys(authorCounts),
    (author) => authorCounts[author]
  );

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogsWithLodash,
};
