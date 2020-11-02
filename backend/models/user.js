const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // installé

// data model for a user, UserId created by MongoDB
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);

