const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
    } else {
      request.token = null
    }
    next()
  }

  const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.substring(7); 
      try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken.id) {
          throw new Error('Token missing or invalid');
        }

        const user = await User.findById(decodedToken.id);
        if (!user) {
          throw new Error('User not found');
        }
       
        request.user = user;
      } catch (error) {
        return response.status(401).json({ error: error.message });
      }
    } else {

      return response.status(401).json({ error: 'Token missing or invalid' });
    }
    next();
  };
  
  module.exports = { 
    tokenExtractor,
    userExtractor
  }
