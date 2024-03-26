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

router.delete(
   '/user',
   adminController.deleteUserByPseudo
);

router.post(
   '/categorie',
   adminController.createCategory
);

router.delete(
   '/categorie',
   adminController.deleteCategory
);

router.post(
   '/article',
   upload.single('photo'),
   adminController.createArticle
);

// router.put(
//    '/article',
//    upload.single('photo'),
//    adminController.updateArticle
// );

router.delete(
   '/:id',
   adminController.deleteArticle
);



module.exports = router;
