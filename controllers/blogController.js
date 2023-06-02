const mongoose = require('mongoose');
const Blog = require('../models/blog');

const blogController = {};
blogController.post = {};

blogController.getAll = async function (req, res) {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

blogController.getByAuthor = async function (req, res) {
  const { id: blogId } = req.params;

  try {
    const blogs = await Blog.find({ author: mongoose.Types.ObjectId(blogId) });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

blogController.create = async function (req, res) {
  const { title, description, image, approved } = req.body;

  try {
    const isCreated = await Blog.findOne({ title });

    if (isCreated) {
      res.status(500).json({ message: 'Blog already exist' });
      return;
    }

    await Blog.create({
      title,
      description: description || null,
      author: req.userId,
      image: image || null,
      approved: approved || false,
      posts: [],
    });
    res.status(201).json({ message: 'Blog was successfully created' });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

blogController.edit = async function (req, res) {
  const { blogId, title, description, image } = req.body;

  try {
    await Blog.findById(blogId, async (err, blog) => {
      if (err) {
        return res.status(409).json({ message: `Server error: ${err}` });
      }

      if (!blog) {
        return res.status(409).json({ message: 'Blog is not defined' });
      }

      if (title) {
        const isCreated = await Blog.findOne(title);

        if (isCreated) {
          res.status(500).json({ message: 'Title already defined' });
          return;
        }
      }

      title && (blog.title = title);
      description && (blog.description = description);
      image && (blog.image = image);
      blog.updatedAt = new Date();

      await blog.save();
      res.status(200).json({ message: 'Blog was successfully edited' });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

blogController.remove = async function (req, res) {
  const { blogId } = req.body;

  try {
    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({ message: 'Blog was successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

blogController.post.create = async function (req, res) {
  const { blogId, postText } = req.body;

  try {
    await Blog.findById(blogId, async (req, blog) => {
      if (err) {
        res.status(404).json({ message: 'Post already exist' });
        return;
      }

      blog.posts = [...blog.posts, { userId: req.userId, text: postText }];
      await blog.save();
      res.status(201).json({ message: 'Post was successfully created' });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

blogController.post.edit = async function (req, res) {
  const { blogId, postId, text } = req.body;

  try {
    await Blog.findById(blogId, async (err, blog) => {
      if (err) {
        return res.status(409).json({ message: `Server error: ${err}` });
      }

      if (!blog) {
        return res.status(409).json({ message: 'Blog is not defined' });
      }

      blog.posts = blog.posts.map((post) => {
        if (post._id.toString() === postId) {
          post.text = text;
          post.updatedAt = new Date();
        }
        return post;
      });
      await blog.save();
      res.status(200).json({ message: 'Post was successfully edited' });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

blogController.post.delete = async function (req, res) {
  const { blogId, postId } = req.body;

  try {
    await Blog.findById(blogId, async (err, blog) => {
      if (err) {
        return res.status(409).json({ message: `Server error: ${err}` });
      }

      if (!blog) {
        return res.status(409).json({ message: 'Blog is not defined' });
      }

      blog.posts = blog.posts.filter((post) => post._id.toString() !== postId);
      await blog.save();
      res.status(200).json({ message: 'Post was successfully deleted' });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error ${err}` });
  }
};

module.exports = blogController;
