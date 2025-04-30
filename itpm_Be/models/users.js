const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Role: String,
    Status: String
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;