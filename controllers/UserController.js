//dependencies
var express = require('express');
var admin = require('firebase-admin');
var db = require('../db');
//setup
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/users', (req, res) => {
    var response = [];
    const usersSnapshot = db.collection('users').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                response.push(doc.data());
            });
            res.status(200).send({errorMessage: "", responseData: response});
        })
    .catch(err => {
        console.log('Error getting documents', err);
        res.status(500).send({errorMessage: err.message, responseData: ""});
    });
});

router.get('/users/:userID', async function(req, res){
    getUser(req.params.userID).then( doc => {
        res.status(200).send({errorMessage: "", responseData: doc});
    })
        .catch(err => {
            console.log(err);
            res.status(500).send({errorMessage: err, responseData: ""});
        });
});

router.put('/users/:userID', (req, res) => {
    try{
        var setPreference = db.collection('users').doc(req.params.userID).update(req.body);
        res.status(200).send({errorMessage: "", responseData: "User's preferences have been updated successfully."});
    }
    catch(err) {
        res.status(500).send({errorMessage: err.message, responseData: ""});
    }
});

async function getUser(userID)
{
    return new Promise((resolve, reject) => {
        let user = db.collection('users').doc(userID);
        let retrievedUser = user.get()
            .then(doc => {
                if(!doc.exists){
                    reject("User does not exist in the database.");
                }
                else{
                    resolve(doc.data());
                }
            })
            .catch(err => {
                reject(err.message);
            });
    });
}
module.exports = router;
