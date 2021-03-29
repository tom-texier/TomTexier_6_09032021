const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'L\'adresse mail est requise'],
        unique: true
    },
    password: { type: String, required: [true, 'Le mot de passe est requis !'] }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);