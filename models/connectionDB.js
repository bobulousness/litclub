const mongoose = require('mongoose');

var catalog = [];

const conSchema = new mongoose.Schema({
    name: String,
    topic: String,
    details: String,
    date: String,
    location: String,
    user: String,
}, {collection: 'connections'});

const conmod = mongoose.model('Connection', conSchema);

async function getConnections() {
    return await conmod.find()
}

async function getConnection(id) {
    return await conmod.findOne({_id: id})
}

async function updateConnection(data, id) {
    console.log("data:")
    console.log(id);
    conmod.findOne({_id: id}).then(function(result){
        console.log(result);
        result.name = data.name;
        result.topic = data.topic;
        result.details = data.details;
        result.date = data.date;
        result.location = data.location;
        result.save();
        return result;
    });
}


module.exports.conmod = conmod;
module.exports.conSchema = conSchema;
module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.updateConnection = updateConnection;
module.exports.catalog = catalog;