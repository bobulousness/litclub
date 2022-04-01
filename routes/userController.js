var express = require('express');
var bodyParser = require('body-parser');
var connectionDB = require('../models/connectionDB');
var profDB = require('../models/UserProfileDB');
var userDB = require('../models/userDB');

var urle = bodyParser.urlencoded({extended: false});

var router = express.Router();

router.post('/login', urle, function (req, res) {
    //find the user
    userDB.model.findOne({uid: req.body.uid, Password: req.body.password}).then(function (result) {
        // if user is found
        if(result){
           //add the user to session data
           req.session.user = result;
           req.session.logged = true;
           res.redirect('/connections');
        } else {
            res.redirect('/login');
        }


    });

})

//sign up
router.post('/signUp', urle, function(req, res){
    //create new user document and put it in the session data
    req.session.user = new userDB.model({
        uid: req.body.uid,
        Fname: req.body.Fname,
        Lname: req.body.Lname,
        Password: req.body.password,
        email: req.body.email
    });
    //save the user to the database
    req.session.user.save();
    req.session.logged = true;
    res.redirect('/connections');
})

//rsvp
router.get('/rsvp', function (req, res) {
    if (req.session.user) {
        var promise = async (connection) => {
            await (profDB.rsvp(connection, req.query.r, req.session.user));
        }
        connectionDB.conmod.findOne({_id: req.query.id}).then(function (result) {
            promise(result).then(function () {
                res.redirect('/savedConnections');
            });
        });

    } else {
        res.redirect('../login');
    }
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            res.negotiate(err);
        }
        res.redirect('../login');
    });
});

router.get('/delete', function (req, res) {
    connectionDB.conmod.findOne({_id: req.query.id}).then(function (result) {
        profDB.model.deleteMany({user: req.session.user, con: result}).catch(function (err) {
            console.log(err);
        });
        res.redirect("../savedConnections");
    });

});


module.exports.router = router;