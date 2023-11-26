const express = require('express');
const router = express.Router();
const connection = require('../database/connexion');


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

router.get('/connexion/:login', async (req, res) => {
  if (req.params.login != '') {
     const values = [req.params.login, req.params.login];

     try {
        console.log('ok');
        const query = `SELECT * FROM utilisateurs WHERE pseudo = ? OR email = ?`;
        const user = await connection.promise().query(query, values);
        res.status(200).json(user[0][0]);
     } catch {
        res.status(500).end('Informations erronées');
     }
  } else {
     res.status(501).end('Informations erronées');
  }
});

module.exports = router;