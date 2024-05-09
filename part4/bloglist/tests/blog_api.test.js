const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have property id instead of _id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.ok(!blog._id)
  })
})

test('creating a new blog post', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10
  }

  const initialBlogs = await Blog.find({})
  const initialBlogCount = initialBlogs.length

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfterPost = await Blog.find({})
  const blogCountAfterPost = blogsAfterPost.length

  assert.strictEqual(blogCountAfterPost, initialBlogCount + 1) 

  const titles = blogsAfterPost.map(blog => blog.title)
  assert.ok(titles.includes('Test Blog'))
})

test('default likes value is 0 if not provided', async () => {
  const newBlogWithoutLikes = {
    title: 'Blog Without Likes',
    author: 'Anonymous',
    url: 'http://example.com/blog_without_likes'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('responds with 400 Bad Request if title or url are missing', async () => {
  const newBlogWithoutTitle = {
    author: 'Test Author',
    url: 'http://example.com/test_blog'
  }

  const newBlogWithoutUrl = {
    title: 'Test Blog',
    author: 'Test Author'
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)
})

test('deleting a blog post', async () => {
  const newBlog = new Blog({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10
  })

  await newBlog.save()

  const initialBlogs = await Blog.find({})
  const initialBlogCount = initialBlogs.length

  const blogToDelete = initialBlogs[initialBlogs.length - 1]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAfterDelete = await Blog.find({})
  const blogCountAfterDelete = blogsAfterDelete.length

  assert.strictEqual(blogCountAfterDelete, initialBlogCount - 1)
})

test('updating a blog post', async () => {
  const newBlog = new Blog({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10
  })

  await newBlog.save()

  const blogToUpdate = await Blog.findOne({ title: 'Test Blog' })

  const updatedBlogData = {
    likes: 20
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 20)
})

after(async () => {
  await mongoose.connection.close()
})

