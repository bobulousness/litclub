var express = require('express');
var bodypars = require('body-parser');
var userController = require('./routes/userController');
var connectionDB = require('./models/connectionDB');
var session = require('express-session');
const mongoose = require('mongoose');
var profDB = require('./models/UserProfileDB');


//mongoose setup
mongoose.connect('mongodb://localhost:27017/Litclub', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

//express setup
var urle = bodypars.urlencoded({extended: false});
var app = express();
app.use(session({secret: 'hello'}));
app.set('view engine', 'ejs');

//databases
var catalog = [];

//routing
app.use('/assets', express.static('assets'));
app.use('/user', userController.router);

//rendering
app.get('/', function (req, res) {
    res.render('index', {logged: req.session.logged});
});

app.get('/contact', function (req, res) {
    res.render('contact', {logged: req.session.logged});
});

app.get('/about', function (req, res) {
    res.render('about', {logged: req.session.logged});
});

app.get('/login', function (req, res) {
    if (req.session.user) {
        res.redirect('user/logout', {logged: req.session.logged});
    } else {
        res.render('login', {logged: req.session.logged});
    }

});

app.get('/signUp', function (req, res) {

    res.render('signUp', {logged: req.session.logged});
});

//connection routes
//singular connection
app.get('/connection', function (req, res) {
    if (req.query.id) {
        var promise = async () => {
            return await connectionDB.getConnection(req.query.id)
        }
        promise().then(function (doc) {
            res.render('connection', {selection: doc, logged: req.session.logged});
        });
    }
});

// connection list
app.get('/connections', function (req, res) {
    //get list of all connections, then put into catalog, then render
    var promise = async () => {
        return await connectionDB.getConnections();
    }
    promise().then(function (doc) {
        res.render('connections', {catalog: doc, logged: req.session.logged});
    });
});

//saved connections
app.get('/savedConnections', function (req, res) {

    if (req.session.logged) {
        var promise = async () => {
            var result = await (profDB.getUserCons(req.session.user));
            return result;
        }
        promise().then(function (result) {
            res.render('savedConnections', {
                catalog: result,
                logged: req.session.logged,
                uid: req.session.user._id
            });
        });
    } else {
        res.redirect('/login');
    }
});


//update connection
app.post('/updateConnection', urle, function(req, res){
    var promise = async () => {
        await profDB.updateCon(req.body,req.query.id);
    }
    promise().then(function(){
        res.redirect('/savedConnections');
    })
})

//new connection
app.post('/newConnection', urle, function (req, res) {
    //add new connection
    var promise = async () => {
        return await profDB.addNewCon(req.body, req.session.user);
    }
    //then save result and redirect to connection page
    promise().then(function (result) {
        result.save();
        res.redirect("/connection?id=" + result._id);
    });
});



//
app.get('/newConnection', function (req, res) {
    if (req.session.logged===undefined || !req.session.logged) {
        res.redirect('/login');
    } else if (req.query.id) {
        var promise = async () => {
            return await connectionDB.getConnection(req.query.id);
        }
        promise().then(function(result){
            res.render('newConnection', {logged: req.session.logged, connection: result});
        });
    } else {
        res.render('newConnection', {logged: req.session.logged, connection: undefined});
    }

});


app.listen(3000);

