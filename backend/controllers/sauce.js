const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    console.log(sauceObjet);
    const sauce = new Sauce({
        ...sauceObjet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then((sauce) => { res.status(201).json({ sauce }); })
        .catch((error) => { res.status(400).json({ error }) });
}

exports.getAllSauces = (req, res, next) => {

}