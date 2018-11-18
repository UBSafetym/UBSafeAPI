//dependencies
var Expo = require('expo-server-sdk').Expo;
var express = require('express');
var admin = require('firebase-admin');
var db = require('../db').db;
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var User = require('../models/user');
var Response = require('../models/response');
var Alert = require('../models/alert');
var Session = require('../models/companionsession');

/* CREATE A COMPANION SESSION & SEND INVITES TO THE SESSION:
 *
 * API Endpoint: POST /companionsession + body:
 * {
 *     "travellerID": INSERT_TRAVELLERS_USERID,
 *     "watcherIDs": [ARRAY_OF_WATCHER_USERIDS],
 *     "travellerDest": geopoint,
 *     "travellerSource": geopoint,
 *     "travellerLocation": geopoint,
 *     "lastUpdated": dateTime
 * }
 */
router.post('/companionsession', async (req, res) => {
    try{
        let session = await Session.createSession(req.body);
        console.log(session);
        let message = Alert.createMessage(session.data.traveller.name, Alert.INVITED_TO_SESSION, session);
        let tokens = await Session.getWatcherTokensFromIDs(req.body.watcherIDs);
        await Alert.sendNotifications(tokens, message);
        res.status(200).send(new Response(200, "", session))
    }
    catch(err){
        console.log(err);
        res.status(500).send(new Response(500, err, ""));
    }
});

/* JOIN A COMPANION SESSION:
 *
 * API Endpoint: PUT /companionsession/join/ + body
 * {
 *      "sessionID": string,
 *      "watcherID": string
 * }
 */
router.put('/companionsession/join', async (req, res) => {
    try{
        let watcher = await User.getUser(req.body.watcherID);
        let newWatcher = Session.makeSessionProfile(watcher);

        let sessionRef = db.collection('companion_sessions').doc(req.body.sessionID);
        await sessionRef.update({joinedWatchers: admin.firestore.FieldValue.arrayUnion(newWatcher)});

        let session = await Session.getSession(req.body.sessionID);
        let travellerToken = [session.traveller.deviceToken];
        let message = Alert.createMessage(watcher.userName, Alert.JOINED_SESSION);
        await Alert.sendNotifications(travellerToken, message);
        res.status(200).send(new Response(200, "", "Successfully joined session!"));
    }
    catch(err){
        console.log(err);
        res.status(500).send(new Response(500, err, ""));
    }
});

/* DELETE A COMPANION SESSION:
 *
 * API Endpoint: DELETE /companionsession/:sessionID
 */
router.delete('/companionsession/:sessionID', async (req, res) => {
    try{
        let sessionRef = db.collection('companion_sessions').doc(req.params.sessionID);
        await sessionRef.delete();
        res.status(200).send(new Response(200, "", "Session has been removed from the database."));
    }
    catch(err){
        console.error(err);
        res.status(500).send(new Response(500, err, ""));
    }
});


/* RATE A COMPANION SESSION:
 *
 * API Endpoint: POST /companionsession/:sessionID/rate + body:
 * {
 *     "rating": number between 0 and 5
 * }
 */
router.post('/companionsession/:sessionID/rate', async (req, res) => {
    try {
        let session = await Session.getSession(req.params.sessionID);
        session.joinedWatchers.forEach(async (watcher) => {
            let user = await User.getUser(watcher.id);
            user.ratingHistory.push(req.body.rating);
            user.rating = User.getAvgRating(user.ratingHistory);
            console.log(user);
            await db.collection('users').doc(user.userID).update(user);
        });
        res.status(200).send(new Response(200, "", session));
    }
    catch(err){
        res.status(500).send(new Response(500, err, ""));
    }
});

module.exports.router = router;
