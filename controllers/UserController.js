//dependencies
var express = require('express');
var admin = require('firebase-admin');
var db = require('../db').db;
var User = require('../models/user');
var Response = require('../models/response');
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
    User.getUser(req.params.userID).then( result => {
        res.status(200).send(new Response(200, "", result));
        })
        .catch(err => {
            res.status(500).send(new Response(500, err, ""));
        });
});

/*
 * API Endpoint: PUT /users/{userID} + body
 * - note that changes to a users preferences
 *   must not be nested and must be denoted by
 *   inserting a "Preferences.INSERT_PREFERENCE_HERE"
 *   e.g.
 *   {
 *      "userName": "Updated User Name",
 *      "preferences.minAge": 20
 *   }
 */
router.put('/users/:userID', async (req, res) => {
    let body = req.body;
    for(var propName in body)
    {
        if(body[propName] === null || body[propName] === undefined)
        {
            delete body[propName];
        }
    }
    if(Object.keys(body).length === 0 && body.constructor === Object)
    {
        res.status(200).send(new Response(200, "", "No updates were sent."));
    }
    else{
        var userRef = db.collection('users').doc(req.params.userID);
        userRef.update(body).then(dbRes => {
            console.log(dbRes);
            res.status(200).send(new Response(200, "", "User has been updated."));
        }).catch(err =>{
             res.status(500).send(new Response(500, err.message, ""));
        });
    }
});

module.exports.router = router;
