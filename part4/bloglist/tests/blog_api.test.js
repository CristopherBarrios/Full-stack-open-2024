const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper');

const api = supertest(app)


let token = '';

beforeEach(async () => {

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const response = await await api.post('/api/login/').send({
    username: 'root',
    password: 'sekret'
  });
  token = response.body.token;
  // console.log(token);
});

test('notes are returned as json', async () => {

  await api
    .get('/api/blogs')    
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have property id instead of _id', async () => {
  const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutUrl)
    .expect(400)
})

test('deleting a blog post', async () => {

  const decodedToken = jwt.verify(token, process.env.SECRET); 

  const newBlog = new Blog({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10,
    user: decodedToken.id 
  })

  await newBlog.save()

  const initialBlogs = await Blog.find({})
  const initialBlogCount = initialBlogs.length

  const blogToDelete = initialBlogs[initialBlogs.length - 1]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 20)
})


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('Username already exists'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('responds with 401 Unauthorized if token is missing when creating a new blog post', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 10
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})

