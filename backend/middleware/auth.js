// Importer le package jsonwebtoken pour la gestion du Token d'authentification
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupérer le token de l'entête Authorization
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN); // Vérifier et décoder le token
        const userId = decodedToken.userId; // Récupérer l'ID de l'utilisateur dans le token
        // Si l'ID de l'utilisateur qui effectue la requête ne correspond pas à l'ID utilisateur du token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID'; // Générer une erreur
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};