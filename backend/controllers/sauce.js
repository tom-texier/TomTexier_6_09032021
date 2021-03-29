const fs = require('fs');

const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObjet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(sauce => res.status(201).json({ message: 'La sauce a bien été créée !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }
    if (req.file) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'La sauce a bien été suprimmée !' }))
                .catch(error => res.status(400).json({ error }));
        });
    } else {
        Sauce.updateOne({
                _id: req.params.id
            }, {
                ...sauceObject,
                _id: req.params.id
            })
            .then(sauce => res.status(200).json({ message: 'La sauce a bien été modifiée !' }))
            .catch(error => res.status(400).json({ error }))
    }
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'La sauce a bien été suprimmée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
}

exports.opinionSauce = (req, res, next) => {
    switch (req.body.like) {
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({ message: 'Ton avis a été pris en compte!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId },
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({ message: 'Ton avis a été pris en compte!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(404).json({ error }));
            break;
        case 1:
            Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId },
                    _id: req.params.id
                })
                .then(() => res.status(201).json({ message: 'Ton like a été pris en compte !' }))
                .catch((error) => res.status(400).json({ error }));
            break;
        case -1:
            Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId },
                    _id: req.params.id
                })
                .then(() => res.status(201).json({ message: 'Ton dislike a été pris en compte !' }))
                .catch((error) => res.status(400).json({ error }));
            break;
        default:
            console.error('Cette valeur n\'est pas valide !');
    }

}