// Importer le package bcrypt pour le hachage du mot de passe
const bcrypt = require("bcrypt");

// Importer le package jsonwebtoken pour la gestion du Token d'authentification
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

// Importer le modèle d'un Utilisateur
const User = require('../models/User');

// Ajouter un utilisateur (Inscription)
exports.signup = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    bcrypt.hash(req.body.password, 10) // Hachage du mot de passe
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save() // Enregistrement de l'utilisateur dans le BD
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Connecter un utilisateur
exports.login = (req, res, next) => {
    // Récupérer l'utilisateur selon son email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparer les mots de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si le mot de passe est bon
                    // Retourner l'ID de l'utilisateur et son Token d'authentification
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            'mYq3t6w9z$B&E)H@McQfTjWnZr4u7x!A', { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};