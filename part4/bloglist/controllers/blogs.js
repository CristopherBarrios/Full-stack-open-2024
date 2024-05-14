const blogsRouter  = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware');



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs)
  })
  
  blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title or url missing' })
    }

    const user = request.user; 

    const blog = new Blog({
      ...body,
      user: user._id
    })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  })


blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogId = request.params.id;
  const user = request.user; 

  if (!request.token || !user.id) {
    return response.status(401).json({ error: 'Unauthorized: Token missing or invalid' });
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Forbidden: You are not the creator of this blog' });
  }

  await Blog.findOneAndDelete({ _id: blogId });
  response.status(204).end();
})

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const updatedBlogData = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(id, updatedBlogData, { new: true })

  response.json(updatedBlog)
})


  module.exports = blogsRouter
  