const jwt = require('jsonwebtoken');
const ConnexionDAO = require('./ConnexionDAO');
const { json } = require('express');
class OauthDAO {
   static generateAccessToken(user) {
      const payload = {
         id: user.id_utilisateur,
         status: user.is_admin ? 'admin' : 'user',
      };
      return jwt.sign(payload, 'RANDOM_TOKEN_SECRET', { expiresIn: '1h' });
   }

   static async generateRefreshToken(user) {
      const existingRefreshToken = await OauthDAO.findRefreshToken(
         user.id_utilisateur
      );

      const refreshPayload = {
         id: user.id_utilisateur,
         status: user.is_admin ? 'admin' : 'user',
      };

      if (!existingRefreshToken) {
         const refreshToken = jwt.sign(
            refreshPayload,
            'RANDOM_REFRESH_TOKEN_SECRET',
            { expiresIn: '7d' }
         );
         await OauthDAO.addRefreshToken(user.id_utilisateur, refreshToken);
         return refreshToken;
      }
      return existingRefreshToken;
   }

   static async findRefreshToken(userId) {
      const connexion = ConnexionDAO.connect();
      // Implement your logic here to find the refresh token for a user by their ID.
      // This is usually done by querying your database. The specific implementation will depend on the database you are using.
      // Here is a placeholder implementation:
      try {
         const query = 'SELECT * FROM oauth WHERE id_utilisateur = ?';
         const values = [userId];
         const result = await connexion.promise().query(query, values);

         if (result.length > 0 && result[0][0]) {
            return result[0][0].refresh_token;
         }
         return null;
      } finally {
         ConnexionDAO.disconnect();
      }
   }

   static async addRefreshToken(userId, refreshToken) {
      const connexion = ConnexionDAO.connect();
      // Implement your logic here to add a refresh token for a user by their ID.
      // This is usually done by inserting/updating a record in your database. The specific implementation will depend on the database you are using.
      // Here is a placeholder implementation:
      const query =
         'INSERT INTO oauth (id_utilisateur, refresh_token) VALUES (?, ?)';
      const values = [userId, refreshToken];
      await connexion.promise().query(query, values);
      ConnexionDAO.disconnect();
      return true;
   }

   static verifyToken(req, res, secret = 'RANDOM_TOKEN_SECRET') {
      const authorizationHeader = req.header('Authorization');
      console.log(authorizationHeader);

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
         return res
            .status(401)
            .json({ success: false, message: 'Invalid authorization header' });
      }
      const token = authorizationHeader.replace('Bearer ', '');
      if (!token) {
         return res
            .status(401)
            .json({ success: false, message: 'Authorization token not found' });
      }
      try {
         const decoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
         req.user = decoded;
         if (req.user.status !== 'admin') {
            return res
               .status(401).send(false);
         } else {
            return res.status(200).send(true);
         }
      } catch (err) {
         throw new Error(
            err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
         );
      }
   }

   static refreshToken(refreshToken) {
      const decoded = this.verifyToken(
         refreshToken,
         'RANDOM_REFRESH_TOKEN_SECRET'
      );
      return this.generateAccessToken(decoded);
   }
}

module.exports = OauthDAO;
