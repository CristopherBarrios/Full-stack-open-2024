const blogsRouter  = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs)
  })
  
  blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'title or url missing' })
    }
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
  
user

    const blog = new Blog({
      ...body,
      user: user._id
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
  