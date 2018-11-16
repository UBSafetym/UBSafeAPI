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
router.post('test/users/:userID', (req, res) => {
    var newUser = createUser(req.body);
});

function createUser(user)
{
    var newUser = {
        "userName": user.userName,
        "userID": user.userID,
        "age": user.age,
        "deviceToken": user.deviceToken,
        "gender": user.gender,
        "rating": user.rating,
        "preferences": user.preferences,
        "ratingHistory": user.ratingHistory,
    };
    return newUser;
}

/*
 * API Endpoint: GET /users/{userID}
 * - returns user with id = {userID}
 */
router.get('/users/:userID', async (req, res) => {
    getUser(req.params.userID).then( result => {
        res.status(result.status).send(result);
        })
        .catch(err => {
            res.status(err.status).send(err);
        });
});

/*
 * API Endpoint: PUT /users/{userID} + body
 * - note that changes to a users preferences
 *   must not be nested and must be denoted by
 *   inserting a "Preferences.INSERT_PREFERENCE_HERE"
 *   e.g.
 *   {
 *      "User Name": "Updated User Name",
 *      "Preferences.MinAge": 20
 *   }
 */
router.put('/users/:userID', (req, res) => {
    try{
        let setPreference = db.collection('users').doc(req.params.userID).update(req.body);
        res.status(200).send({errorMessage: "", responseData: "User's preferences have been updated successfully."});
    }
    catch(err) {
        res.status(500).send({errorMessage: err.message, responseData: ""});
    }
});


module.exports.getUser = getUser;
module.exports.router = router;
