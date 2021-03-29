// Importer le package multer pour gérer les fichiers entrants dans les requête HTTP
const multer = require('multer');

// Définir le dictionnaire de MIME_TYPES 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Objet de configuration
const storage = multer.diskStorage({
    // Définir la destination du fichier
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Définir le nom du fichier
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');