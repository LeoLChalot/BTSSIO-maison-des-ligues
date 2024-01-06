const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const ConnexionDAO = require('../models/ConnexionDAO');
const UtilisateurDAO = require('../models/UtilisateurDAO');
const OauthDAO = require('../models/OauthDAO');
const PanierDAO = require('../models/PanierDAO');

router.post('/inscription', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { prenom, nom, pseudo, email, mot_de_passe } = req.body;
      const registerDate = new Date();

      if (prenom && nom && pseudo && email && mot_de_passe) {
         const passwordHash = await bcrypt.hash(mot_de_passe, 10);
         const user = [
            uuidv4(),
            prenom,
            nom,
            pseudo,
            email,
            passwordHash,
            false,
            registerDate,
         ];
         const utilisateur = new UtilisateurDAO();
         const existMail = await utilisateur.find(connexion, 'email', email);
         const existPseudo = await utilisateur.find(
            connexion,
            'pseudo',
            pseudo
         );
         if (existMail[0].length !== 0)
            res.status(400).json({
               success: false,
               message: 'Cet email est déjà utilisé',
            });
         if (existPseudo[0].length !== 0)
            res.status(400).json({
               success: false,
               message: 'Ce pseudo est déjà utilisé',
            });

         await utilisateur.create(connexion, user);

         res.status(200).json({ message: 'Le compté à été créé avec succès' });
      } else {
         res.status(400).end({
            success: false,
            message: 'Informations erronées',
         });
      }
   } catch (error) {
      console.error('Error connecting user:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.post('/connexion', async (req, res) => {
   const { login, mot_de_passe } = req.body;
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      if (login && mot_de_passe) {
         const utilisateurDAO = new UtilisateurDAO();
         let utilisateur = await utilisateurDAO.find(connexion, 'email', login);
         if (utilisateur[0].length === 0) {
            utilisateur = await utilisateurDAO.find(connexion, 'pseudo', login);
         }
         if (utilisateur[0].length === 0) {
            res.status(400).json({
               success: false,
               msg: "L'email et le mot de passe ne correspondent pas",
            });
            return;
         }
         utilisateur = utilisateur[0][0];
         if (!bcrypt.compareSync(mot_de_passe, utilisateur.mot_de_passe)) {
            res.status(400).json({
               success: false,
               msg: 'Mot de passe incorrect',
            });
            return;
         }
         const token = OauthDAO.generateAccessToken(utilisateur);
         const refreshToken = await OauthDAO.generateRefreshToken(
            connexion,
            utilisateur
         );
         const panierDAO = new PanierDAO();
         const panier = await panierDAO.find(
            connexion,
            'id_utilisateur',
            utilisateur.id_utilisateur
         );

         if (panier[0].length === 0) {
            const panier = [uuidv4(), utilisateur.id_utilisateur, new Date()];
            await panierDAO.create(connexion, panier);
         }

         utilisateur = {
            id: utilisateur.id_utilisateur,
            pseudo: utilisateur.pseudo,
            email: utilisateur.email,
            isAdmin: utilisateur.is_admin,
         };

         res.status(200).json({
            success: true,
            message: 'Utilisateur connecté',
            infos: {
               utilisateur: {
                  ...utilisateur,
                  token: token,
               },
               panier: panier[0],
            },
         });
      } else {
         res.status(400).json({
            success: false,
            msg: 'Email et mot de passe requis',
         });
      }
   } catch (error) {
      console.error('Error connecting user:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

module.exports = router;
