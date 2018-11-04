//dependencies
var express = require('express');
var admin = require('firebase-admin');
var db = require('../db');
//setup
var router = express.Router();

router.get('/recommendations', (req, res) => {
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

module.exports = router;
