const jwt = require('jsonwebtoken');
const sendError = (res, message) => {
   res.status(401).json({ success: false, message });
};

module.exports = (req, res, next) => {
   console.log('res type:', typeof res);
   const authorizationHeader = req.header('Authorization');
   // const errorMessage = (message) => res.status(401).json({ success: false, message });

   if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return sendError(res, 'Invalid authorization header');
   }

   const token = authorizationHeader.replace('Bearer ', '');
   if (!token) {
      return sendError(res, 'Authorization token not found');
   }

   try {
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      req.user = decoded;
      if (req.user && req.user.status === 'admin') {
         next();
      } else {
         return sendError('Access denied. User is not an admin.');
      }
   } catch (err) {
      return sendError(
         err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
      );
   }
};
