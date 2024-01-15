const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

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

const adminController = require('../controller/adminController');

router.get('/', async (req, res) => {
   try {
      res.status(200).json(req.user);
   } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).send('Internal Server Error');
   }
});

router.delete('/user', adminController.deleteUserByPseudo, async (req, res) => {
   res.status(200).json({ success: true });
});

router.post('/categorie', adminController.createCategory, async (req, res) => {
   res.status(200).json({ success: true });
});

router.delete('/categorie', adminController.deleteCategory, async (req, res) => {
      res.status(200).json({ success: true });
   }
);

router.post('/article', upload.single('photo'), adminController.createArticle, async (req, res) => {
      res.status(200).json({ success: true });
   }
);

router.put('/article', upload.single('photo'), adminController.updateArticle, async (req, res) => {
   res.status(200).json({ success: true });
});

router.delete('/article', async (req, res) => {
   let connexion;
   try {
      connexion = await ConnexionDAO.connect();
      const id = req.body.id;
      const articleDAO = new ArticleDAO();
      const articleMagasin = await articleDAO.find(connexion, 'id_article', id);
      if (articleMagasin[0].length === 0) {
         res.status(404).json({
            success: false,
            message: 'Article non trouvée',
         });
         return;
      }
      if (quantity) {
         const updateArticle = {
            quantite: articleMagasin[0][0].quantite - quantity,
            id_article: articleMagasin[0][0].id_article,
         };
         console.log(updateArticle);
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
