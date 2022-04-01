const mongoose = require('mongoose');
const conDB = require('./connectionDB.js');
const userDB = require('./userDB');

const profSchema = new mongoose.Schema({
    user: userDB.schema,
    con: conDB.conSchema,
    rsvp: String

}, {collection: "userConnections"});

const model = mongoose.model("profile", profSchema);


module.exports.getUserCons = async (user) => {
    return await model.find({user: user});
};

module.exports.rsvp = async function (con, rsvp, user) {

    var result = await model.findOne({$and: [{user: user}, {con: con}]});

    if (result) {
        result.rsvp = rsvp;
        result.save();
        console.log("success");
    } else {
        let result = new model({user: user, con: con, rsvp: rsvp});
        result.save();
        console.log("created new ucon");
    }
};

module.exports.addNewCon = async function (nucon, user) {
    return new conDB.conmod({
        user: user._id,
        name: nucon.name,
        topic: nucon.topic,
        details: nucon.details,
        location: nucon.location,
        date: nucon.date,
    })
};

module.exports.updateCon = async function (data, id) {
    conDB.updateConnection(data, id);
    model.findOne({"con._id": id}).then(function(result){
        result.con.name = data.name;
        result.con.topic = data.topic;
        result.con.details = data.details;
        result.con.date = data.date;
        result.con.location = data.location;
        result.save();
        return result;
    })
}

module.exports.model = model;
