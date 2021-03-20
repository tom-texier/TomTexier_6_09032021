const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const sauceCtlr = require('../controllers/sauce');

router.post('/', sauceCtlr.createSauce);

module.exports = router;