const express = require('express');
const router = express.Router();

const cookieParser = require('cookie-parser');

const userController = require('../controller/userController');

router.post('/inscription', userController.register, async (req, res) => {
   res.status(200).json({ success: true });
});

router.post('/connexion', cookieParser(), userController.login, async (req, res) => {
   res.status(200).json({ success: true });
});

module.exports = router;
