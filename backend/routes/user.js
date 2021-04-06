const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const userCtrl = require('../controllers/user');

router.post('/signup',
    check('email').isEmail(),
    userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;