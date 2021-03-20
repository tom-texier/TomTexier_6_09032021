const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtlr = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtlr.createSauce);
router.get('/', auth, sauceCtlr.getAllSauces);

module.exports = router;