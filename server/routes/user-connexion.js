const express = require('express');
const router = express.Router();
const connection = require('../database/connexion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

connection.connect((err) => {
   if (err) {
      console.log('Erreur de connexion : ' + err.stack);
      return;
   } else {
      console.log(`Connexion réussie à la BDD : ${process.env.DB_NAME}!`);
   }
});

router.post('/inscription', async (req, res) => {
   console.log('.post/inscription');
   console.log(req.body.id_utilisateur);
   if (
      req.body.id_utilisateur != '' &&
      req.body.prenom != '' &&
      req.body.nom != '' &&
      req.body.pseudo != '' &&
      req.body.email != '' &&
      req.body.mot_de_passe != ''
   ) {
      const values = [
         req.body.id_utilisateur,
         req.body.prenom,
         req.body.nom,
         req.body.pseudo,
         req.body.email,
         req.body.mot_de_passe,
      ];
      console.log(values);
      try {
         const query = `INSERT INTO utilisateurs(id_utilisateur, prenom, nom, pseudo, email, mot_de_passe) VALUES(?, ?, ?, ?, ?, ?)`;
         await connection.promise().query(query, values);
         res.status(200).json({ msg: 'status 200' });
      } catch {
         res.status(500).end('Informations erronées');
      }
   } else {
      res.status(501).end('Informations erronées');
   }
});

router.post('/connexion', async (req, res) => {
   console.log('.post/connexion');
   const { login, mot_de_passe } = req.body;

   if (login && mot_de_passe) {
      try {
         const query =
            'SELECT * FROM utilisateurs WHERE email = ? OR pseudo = ?';
         const [users] = await connection
            .promise()
            .query(query, [login, login]);

         if (users.length === 0) {
            return res.status(401).json({ msg: 'Utilisateur non trouvé' });
         }

         const user = users[0];
         const validPassword = await bcrypt.compare(
            mot_de_passe,
            user.mot_de_passe
         );
         if (!validPassword) {
            return res.status(401).json({ msg: 'Mot de passe incorrect' });
         }

         const isAdmin = user.is_admin == true;
         console.log(isAdmin);
         
         const payload = {
            id: user.id_utilisateur,
            status: isAdmin ? 'admin' : 'user',
         };

         const token = jwt.sign(payload, 'RANDOM_TOKEN_SECRET', {
            expiresIn: '100y' // Set expiration to 100 years
         });

         res.json({
            msg: 'Connexion réussie',
            token,
            status: isAdmin ? 'admin' : 'user',
            user: user.id_utilisateur,
         });
      } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Erreur interne du serveur' });
      }
   } else {
      res.status(400).json({ msg: 'Email et mot de passe requis' });
   }
});


module.exports = router;
