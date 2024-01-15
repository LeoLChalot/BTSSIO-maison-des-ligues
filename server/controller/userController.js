const ConnexionDAO = require('../models/ConnexionDAO');
const UtilisateurDAO = require('../models/UtilisateurDAO');
const PanierDAO = require('../models/PanierDAO');

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

/**
 * ## Inscrire un utilisateur
 *
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 * @return {Promise<void>} Une promesse qui contient le résultat.
 */
exports.register = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { prenom, nom, pseudo, email, mot_de_passe } = req.body;
      const registerDate = new Date();
      if (prenom && nom && pseudo && email && mot_de_passe) {
         const user = {
            id_utilisateur: uuidv4(),
            prenom: prenom,
            nom: nom,
            pseudo: pseudo,
            email: email,
            mot_de_passe: mot_de_passe,
            is_admin: false,
            register_date: registerDate,
         };

         // ! Envoyer une erreur si l'utilisateur existe
         const utilisateur = new UtilisateurDAO();
         const findWithMail = { email: email };
         const findWithPseudo = { pseudo: pseudo };
         const existMail = await utilisateur.find(connexion, findWithMail);
         const existPseudo = await utilisateur.find(connexion, findWithPseudo);
         if (existMail[0].length !== 0) {
            res.status(400).json({
               success: false,
               message: 'Cet email est déjà utilisé',
            });
            return;
         }
         if (existPseudo[0].length !== 0) {
            res.status(400).json({
               success: false,
               message: 'Ce pseudo est déjà utilisé',
            });
            return;
         }

         // ? Creer l'utilisateur
         await utilisateur.create(connexion, user);

         res.status(200).json({ message: 'Le compté à été créé avec succès' });
      } else {
         // ! Envoyer une erreur si l'un des champs du formulaire est manquant
         res.status(400).end({
            success: false,
            message: 'Informations erronées',
         });
      }
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};

/**
 * ## Connexion d'un utilisateur
 *
 * @param {object} req - L'objet de requête.
 * @param {object} res - L'objet de réponse.
 * @return {Promise<void>} - Une promesse qui contient le résultat.
 */
exports.login = async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { login, mot_de_passe } = req.body;
      if (login && mot_de_passe) {
         const findWithMail = {
            email: login,
         };
         const findWithPseudo = {
            pseudo: login,
         };
         
         // ? Trouver l'utilisateur
         const utilisateurDAO = new UtilisateurDAO();

         let utilisateur = await utilisateurDAO.find(connexion, findWithMail);
         if (utilisateur[0].length === 0) {
            utilisateur = await utilisateurDAO.find(connexion, findWithPseudo);
         }

         // ! Envoyer une erreur si le couple login/mdp ne correspond pas
         if (utilisateur[0].length === 0) {
            res.status(400).json({
               success: false,
               message: "L'email et le mot de passe ne correspondent pas",
            });
            return;
         }

         utilisateur = {
            id_utilisateur: utilisateur[0][0].id_utilisateur,
            pseudo: utilisateur[0][0].pseudo,
            email: utilisateur[0][0].email,
            isAdmin: utilisateur[0][0].is_admin,
            hash: utilisateur[0][0].mot_de_passe,
         };

         // ? Vérifier le mot de passe
         // ! Envoyer une erreur si le mot de passe ne correspond pas
         if (!bcrypt.compareSync(mot_de_passe, utilisateur['hash'])) {
            res.status(400).json({
               success: false,
               message: 'Mot de passe incorrect',
            });
            return;
         }

         // ? Récupérer le panier de l'utilisateur
         const panierDAO = new PanierDAO();
         const findWithIdUtilisateur = {
            id_utilisateur: utilisateur['id_utilisateur'],
         };

         let panier = await panierDAO.find(connexion, findWithIdUtilisateur);

         // ? Creer un nouveau panier si aucun panier n'est trouvé
         if (panier[0].length === 0) {
            const newPanier = {
               id_panier: uuidv4(),
               id_utilisateur: utilisateur['id_utilisateur'],
               date: new Date(),
            };
            await panierDAO.create(connexion, newPanier);
            panier = await panierDAO.find(connexion, findWithIdUtilisateur);
         }

         let jwt_token = jwt.sign(
            {
               email: utilisateur.email,
               pseudo: utilisateur.pseudo,
               role: utilisateur.isAdmin,
               panier: panier[0][0].id_panier,
            },
            process.env.SECRET_KEY,
            {
               expiresIn: '1h',
            }
         );

         console.log('jwt_token:', jwt_token);

         res.status(200).json({
            success: true,
            message: 'Utilisateur connecté',
            infos: {
               utilisateur: {
                  email: utilisateur.email,
                  pseudo: utilisateur.pseudo,
                  jwt_token: jwt_token,
               },
            },
         });
         return;
      } else {
         // ! Envoyer une erreur si l'email et le mot de passe sont manquants
         res.status(400).json({
            success: false,
            msg: 'Email et mot de passe requis',
         });
         return;
      }
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
};
