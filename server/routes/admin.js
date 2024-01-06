const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const multer = require('multer');

const ConnexionDAO = require('../models/ConnexionDAO');
const UtilisateurDAO = require('./../models/UtilisateurDAO');
const CategorieDAO = require('./../models/CategorieDAO');
const ArticleDAO = require('./../models/ArticleDAO');

const MIME_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png',
};

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'images');
   },
   filename: function (req, file, cb) {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      cb(null, name + Date.now() + '.' + extension);
   },
});
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
   try {
      res.status(200).json(req.user);
   } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).send('Internal Server Error');
   }
});

router.post('/user', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const login = req.body.login;
      let result;
      const utilisateurDAO = new UtilisateurDAO();

      if (!login) {
         result = await utilisateurDAO.find_all(connexion);
         res.status(200).json(result[0]);
         return;
      }
      result = await utilisateurDAO.find(connexion, 'pseudo', login);
      if (result[0].length === 0) {
         result = await utilisateurDAO.find(connexion, 'email', login);
      }
      if (result[0].length === 0) {
         res.status(404).json({
            message: 'Utilisateur non trouvé',
         });
         return;
      }
      res.status(200).json(result[0][0]);
   } catch (error) {
      console.error('Error connecting user:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.delete('/user', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const { pseudo } = req.body;
      const utilisateurDAO = new UtilisateurDAO();
      const user = await utilisateurDAO.find(connexion, 'pseudo', pseudo);
      if (user[0].length === 0) {
         res.status(404).json({
            message: 'Utilisateur non trouvé',
         });
         return;
      }
      const result = await utilisateurDAO.delete(connexion, 'pseudo', pseudo);
      res.status(200).json(result);
   } catch (error) {
      console.error('Error connecting user:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.post('/categorie', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const categorie = req.body.categorie;  

      if (!categorie) {
         return res
            .status(404)
            .json({ success: false, message: 'Categorie non trouvée' });
      }
      const categorieDAO = new CategorieDAO();
      const values = [
         uuidv4(),
         categorie
      ]
      const result = await categorieDAO.create(connexion, values);
      if(result) {
         res.status(201).json({
            success: true,
            message: 'Categorie ajoutée !',
         });
      }

   } catch (err) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.delete('/categorie', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      if (OauthDAO.verifyToken(req, res)) {
         const { id_categorie } = req.body;
         const categorie = await CategorieDAO.getCategoryById(
            connexion,
            id_categorie
         );
         if (!categorie) {
            return res
               .status(404)
               .json({ success: false, message: 'Categorie non trouvée' });
         }
         await CategorieDAO.deleteCategory(connexion, id_categorie);
         res.status(201).json({
            success: true,
            message: 'Categorie supprimée !',
         });
      } else {
         return res
            .status(401)
            .json({ success: false, message: 'Unauthorized' });
      }
   } catch (error) {
      console.error('Error connecting shop:', error);
      throw error;
   } finally {
      if (connexion) {
         ConnexionDAO.disconnect(connexion);
      }
   }
});

router.post('/article', upload.single('photo'), async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const article = {
         id_article: uuidv4(),
         nom: req.body.nom ? req.body.nom : "non nommé",
         photo: req.file ? req.file.path : 'images\\no-image.png',
         description: req.body.description ? req.body.description : "aucune description",
         prix: req.body.prix ? req.body.prix : 0,
         quantite: req.body.quantite ? req.body.quantite : 0,
         categorie_id: req.body.categorie ? req.body.categorie : "pas de catégorie",
      };

      const articleDAO = new ArticleDAO();
      const result = await articleDAO.create(connexion, article);

      if (result) {
         return res.status(201).json({
            success: true,
            message: 'Article ajouté !',
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
});

router.put('/article', upload.single('photo'), async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();

      const article = {
         nom: req.body.nom ? req.body.nom : null,
         photo: req.file ? req.file.path : null,
         description: req.body.description ? req.body.description : null,
         prix: req.body.prix ? req.body.prix : null,
         quantite: req.body.quantite ? req.body.quantite : null,
         categorie_id: req.body.categorie_id ? req.body.categorie : null,
         id_article: req.body.id,
      };

      const filteredArticleData = Object.entries(article)
          .filter(([key, value]) => value !== null)
          .reduce((obj, [key, value]) => {
              obj[key] = value;
              return obj;
          }, {});

      const articleDAO = new ArticleDAO();
      const exists = await articleDAO.find(connexion, 'id_article', article.id_article)

      if(exists[0].length === 0) {
         res
            .status(404)
            .json({ success: false, message: 'Article non trouvée' });
            return
      }

      const result = await articleDAO.update(connexion, filteredArticleData);

      if (result) {
         res.status(201).json({
            success: true,
            message: 'Article mis à jour !',
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
});

router.delete('/article', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const id = req.body.id
      const articleDAO = new ArticleDAO();
      const articleMagasin = await articleDAO.find(connexion, 'id_article', id)
      if(articleMagasin[0].length === 0) {
         res
            .status(404)
            .json({ success: false, message: 'Article non trouvée' });
            return
      }
      if(quantity) {
         const updateArticle = {
            quantite: articleMagasin[0][0].quantite - quantity,
            id_article : articleMagasin[0][0].id_article,
         }
         console.log(updateArticle)
         const result = await articleDAO.update(connexion, updateArticle);
         res.status(201).json({
            success: true,
            message: 'Article(s) supprimé(s) !',
         });
      } else {
         const result = await articleDAO.delete(connexion, 'id_article', id);
         res.status(201).json({
            success: true,
            message: 'Tous les articles supprimés !',
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
});

module.exports = router;
