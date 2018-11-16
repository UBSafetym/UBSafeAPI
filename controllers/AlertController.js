//dependencies
var express = require('express');
var admin = require('firebase-admin');
var db = require('../db');
//setup
var router = express.Router();

/*
 * param: CompanionSessionID
 * param: Body
 */
router.post('/alert', (req, res) => {
        /*
         * TODO:
         *      - retrieve watcher(s) from CompanionSession
         *      - send notification to each watcher
         */
    console.log("Not yet implemented.");
    res.status(500).send({errorMessage: "Not yet implemented", responseData: ""});
});

module.exports.router = router;
