const jwt = require('jsonwebtoken')

module.export = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
  const userId = decodedToken.userId
  req.auth = {userId: userId}
  
  if (req.body.userId && req.body.userId !== userId) {
    throw new Error('Invalid user ID')
  } else {
    next()
  }
}
