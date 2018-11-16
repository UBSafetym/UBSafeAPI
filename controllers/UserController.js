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
router.get('/users', (req, res) => {
    let response = [];
    const usersSnapshot = db.collection('users').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                response.push(doc.data());
            });
            res.status(200).send({errorMessage: "", responseData: response});
        })
    .catch(err => {
        res.status(500).send({errorMessage: err.message, responseData: ""});
    });
});

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

/*
 * Retrieves and returns a user from the db
 */
async function getUser(userID)
{
    return new Promise((resolve, reject) => {
        let user = db.collection('users').doc(userID);
        let retrievedUser = user.get()
            .then(doc => {
                if(!doc.exists){
                    reject({status: 404, errorMessage: "User does not exist in the database.", responseData: ""});
                }
                else{
                    resolve({status: 200, errorMessage: "", responseData: doc.data()});
                }
            })
            .catch(err => {
                    reject({status: 500, errorMessage: "Internal Server Error.", responseData: ""});
            });
    });
}

module.exports.getUser = getUser;
module.exports.router = router;
