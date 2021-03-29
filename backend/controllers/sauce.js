/**
 * Importer le package File System pour la modification du système de fichiers (suppression des images)
 */
const fs = require('fs');

/**
 * Importer le modèle d'une Sauce
 */
const Sauce = require('../models/Sauce');

/** 
 * Créer une Sauce
 */
exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce); // Données de la requête
    const sauce = new Sauce({
        ...sauceObjet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() // Enregistrement de la Sauce dans la BD
        .then(sauce => res.status(201).json({ message: 'La sauce a bien été créée !' }))
        .catch(error => res.status(400).json({ error }));
}

/** 
 * Récupérer toutes les Sauces
 */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

/** 
 * Récupérer une seule Sauce
 * Params: ID de la Sauce dans la requête
 */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

/**
 * Modifier une Sauce
 * Params: ID de la Sauce
 */
exports.modifySauce = (req, res, next) => {
    // Récupérer les données de la requête
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }

    // Si il y a une image
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1]; // Nom de l'image dans le dossier /images/
                fs.unlink(`images/${filename}`, () => { // Supprimer l'image
                    // Mettre à jour la Sauce
                    Sauce.updateOne({
                            _id: req.params.id
                        }, {
                            ...sauceObject,
                            _id: req.params.id
                        })
                        .then(() => { res.status(200).json({ message: 'La sauce a bien été modifiée !' }); })
                        .catch((error) => { res.status(400).json({ error }); });
                });
            })
            .catch(error => res.status(500).json({ error }));
    } else { // Si il n'y a pas d'image
        // Mettre à jour la Sauce
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

/**
 * Supprimer une Sauce
 * Params: ID de la Sauce
 */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                // Supprimer la Sauce
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'La sauce a bien été suprimmée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
}

/**
 * Liker, Disliker ou supprimer son opinion
 */
exports.opinionSauce = (req, res, next) => {
    switch (req.body.like) {
        case 0: // Si l'utilisateur supprime son opinion
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    // Si l'utilisateur avait liké la Sauce
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { likes: -1 }, // Décrémenter de 1 les likes
                                $pull: { usersLiked: req.body.userId }, // Retirer l'ID de l'utilisateur du tableau des liked
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({ message: 'Ton avis a été pris en compte!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    // Si l'utilisateur avait disliké la Sauce
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { dislikes: -1 }, // Décrémenter de 1 les dislikes
                                $pull: { usersDisliked: req.body.userId }, // Retirer l'ID de l'utilisateur du tableau des disliked
                                _id: req.params.id
                            })
                            .then(() => res.status(201).json({ message: 'Ton avis a été pris en compte!' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(404).json({ error }));
            break;
        case 1: // Si l'utilisateur like la Sauce
            Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes: 1 }, // Incrémenter de 1 les likes
                    $push: { usersLiked: req.body.userId }, // Ajouter l'ID de l'utilisateur au tableau des liked
                    _id: req.params.id
                })
                .then(() => res.status(201).json({ message: 'Ton like a été pris en compte !' }))
                .catch((error) => res.status(400).json({ error }));
            break;
        case -1: // Si l'utilisateur dislike la Sauce
            Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: 1 }, // Incrémenter de 1 les disliked
                    $push: { usersDisliked: req.body.userId }, // Ajouter l'ID de l'utilisateur au tableau des disliked
                    _id: req.params.id
                })
                .then(() => res.status(201).json({ message: 'Ton dislike a été pris en compte !' }))
                .catch((error) => res.status(400).json({ error }));
            break;
        default: // Si la valeur attendu n'est pas correcte
            console.error('Cette valeur n\'est pas valide !');
    }

}