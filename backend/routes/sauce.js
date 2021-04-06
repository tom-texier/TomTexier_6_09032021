const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtlr = require('../controllers/sauce');

router.post('/',
    check('name').escape(),
    check('manufacturer').escape(),
    check('description').escape(),
    check('mainPepper').escape(),
    auth, multer, sauceCtlr.createSauce);
router.get('/', auth, sauceCtlr.getAllSauces);
router.get('/:id', auth, sauceCtlr.getOneSauce);
router.put('/:id',
    check('name').escape(),
    check('manufacturer').escape(),
    check('description').escape(),
    check('mainPepper').escape(),
    auth, multer, sauceCtlr.modifySauce);
router.delete('/:id', auth, sauceCtlr.deleteSauce);
router.post('/:id/like', auth, sauceCtlr.opinionSauce);

module.exports = router;