const jwt = require('jsonwebtoken');

module.export = (req, res, next) => {
   const authorizationHeader = req.header('Authorization');
   const errorMessage = (message) => res.status(401).json({ success: false, message });

   if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return errorMessage('Invalid authorization header');
   }

   const token = authorizationHeader.replace('Bearer ', '');
   if (!token) {
      return errorMessage('Authorization token not found');
   }

   try {
      const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      req.user = decoded;
      next();
   } catch (err) {
      console.error(err);
      return errorMessage('Invalid token');
   }
};
