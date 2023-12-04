const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const connection = require('../database/connexion');

connection.connect((err) => {
   if (err) {
      console.log('Erreur de connexion : ' + err.stack);
      return;
   } else {
      console.log(`Connexion réussie à la BDD : ${process.env.DB_NAME}!`);
   }
});

// * Affiche tous les users;
// * ou seulement celui dont l'identifiant est ciblé
router.get('/users', async (req, res) => {
   if (Object.keys(query).length === 0) {
      const sql = 'SELECT * FROM utilisateurs';
      const data = await connection.promise().query(sql);
      const users = data[0];
      res.status(200).send(users);
   } else if (
      Object.getOwnPropertyNames(query).filter(
         (prop) => prop == 'id_utilisateur'
      ).length == 1
   ) {
      const sql = `SELECT * FROM utilisateurs WHERE id_utilisateur = ?`;
      const value = [req.query.id_utilisateur];
      const data = await connection.promise().query(sql, value);
      const user = data[0][0];
      res.status(201).json(user);
   } else {
      res.status(401).send('Demande non autorisée');
   }
});



// * Supprime l'utilisateur ciblé
router.delete('/user/:id', async (req, res) => {
  try {
     const id_article = req.params.id_utilisateur;
     const query = `
     DELETE FROM utilisateurs 
     WHERE id_utilisateur = ?`;
     await connection.promise().query(query, [id_article]);
     res.status(200).end('Article supprimée !');
  } catch (err) {
     throw err;
  }
});

module.exports = router;
