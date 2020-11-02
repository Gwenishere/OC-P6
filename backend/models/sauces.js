const mongoose = require('mongoose');

// data schema
// id: ObjectID — unique id created by MongoDB

const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true},
    mainPepper: { type: String, required: true },
    userId: {type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    usersLiked: { type: [String], required: false, default: 0 },
    usersDisliked: { type: [String], required: false, default: 0 }
});

module.exports = mongoose.model('Sauce', sauceSchema);