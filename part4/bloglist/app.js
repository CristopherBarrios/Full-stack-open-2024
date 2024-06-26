const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger');
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const app = express()



mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI);


mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


  app.use(cors())
  app.use(express.static('dist'))
  app.use(express.json())
  app.use(middleware.tokenExtractor)


  app.use('/api/blogs', middleware.userExtractor, blogsRouter)
  app.use('/api/users', usersRouter);
  app.use('/api/login', loginRouter);

module.exports = app