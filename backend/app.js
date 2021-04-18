// Importer les packages
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotend = require('dotenv').config();

// Importer les routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.error('Connexion à MongoDB échouée !'));

// Headers pour contourner les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Rendre la requête exploitable
app.use(express.json());

// Servir le dossier image de façon statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes attendues
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;