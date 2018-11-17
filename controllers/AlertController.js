//dependencies
var Expo = require('expo-server-sdk').Expo;
var express = require('express');
var admin = require('firebase-admin');
var db = require('../db').db;
//setup
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
var Session = require('../models/companionsession');
var Response = require('../models/response');
var Alert = require('../models/alert');

/*
 * body:
 * {
 *     "alertCode": number
 * }
 */
router.post('/alert/:sessionID', (req, res) => {
    Session.getSession(req.params.sessionID).then(session => {
        let watcherTokens = [];
        let message = Alert.createMessage(session.traveller.name, req.body.alertCode);
        console.log(message);
        let data = {alertCode: req.body.alertCode};
        session.joinedWatchers.forEach(watcher => {
            watcherTokens.push(watcher.deviceToken);
        });
        Alert.sendNotifications(watcherTokens, message, data).then(() => {
            res.status(200).send(new Response(200, "", "Alert has been sent."));
        }).catch(err => {
            console.log(err);
            res.status(500).send(new Response(500, err, ""));
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send(new Response(500, err, ""));
    });
});

/*
 *
 */
router.post('/alert', (req, res) => {
});

module.exports.router = router;
