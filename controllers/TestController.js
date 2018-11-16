//dependencies
var express = require('express');
var admin = require('firebase-admin');
var db = require('../db').db;
//setup
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

/*
 * API Endpoint: GET /users
 * - returns all users in the db
 */
router.post('/test/users', (req, res) => {
    req.body.users.forEach(user => {
        var newUser = createUser(user);
        db.collection('users').doc(newUser.userID).set(newUser)
            .then( docRef => {
                console.log("User " + newUser.userID + " has been added.");
            }).catch( err => {
                console.log(err);
            });
    });
});

router.post('/test/userLoc', (req, res) => {
    geo.set(req.params.userID, { coordinates: new admin.firestore.GeoPoint(37.79, -122.41)})
        .then(doc => {
            res.status(200).send("Succeeded");
        }, (error) => {
            res.status(500).send({errorMessage: error, responseData: ""});
        });
});


function createUser(user)
{
    var newUser = {
        "age": user.age,
        "deviceToken": user.deviceToken,
        "gender": user.gender,
        "preferences": user.preferences,
        "rating": user.rating,
        "ratingHistory": user.ratingHistory,
        "userID": user.userID,
        "userName": user.userName
    };
    console.log(newUser);
    return newUser;
}

module.exports.router = router;
