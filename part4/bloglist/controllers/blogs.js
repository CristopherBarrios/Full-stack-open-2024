const blogsRouter  = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title or url missing' })
    }
    // const user = await User.findOne({});
  
    const latestUser = await User.findOne().sort({ _id: -1 })

    const blog = new Blog({
      ...body,
      user: latestUser._id
    })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  })


blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  
  await Blog.findOneAndDelete(id)
  
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const updatedBlogData = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(id, updatedBlogData, { new: true })

  response.json(updatedBlog)
})


  module.exports = blogsRouter
  