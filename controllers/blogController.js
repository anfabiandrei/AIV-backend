const mongoose = require('mongoose')
const Blog = require('../models/blog');

const blogController = {};

blogController.getAll = async function (req, res) {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error ${err}' });
  }
};

blogController.getById = async function (req, res) {
  const { id: blogId } = req.params;

  try {
    const blogs = await Blog.find({ author: mongoose.Types.ObjectId(blogId) });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error ${err}' });
  }
}

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
      approved,
    });
    res.status(201).json({ message: 'Blog was successfully created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error ${err}' });
  }
};

blogController.remove = async function (req, res) {
  const { blogId } = req.body;

  try {
    await Blog.findByIdAndDelete(blogId);
    res.status(201).json({ message: 'Blog was successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error ${err}' });
  }
};

module.exports = blogController;
