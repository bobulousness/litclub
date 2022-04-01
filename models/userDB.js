const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: String,
    Fname: String,
    Lname: String,
    Password: String,
    email: String
}, {collection: 'Users'});


userSchema.methods.getUser = function (uid) {
    var result = usermod.find(uid);
    return result;
}

module.exports.model = mongoose.model('users', userSchema);


module.exports.schema = userSchema;

