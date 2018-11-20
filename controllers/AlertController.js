//dependencies
const express = require('express');
const Session = require('../models/companionsession');
const Response = require('../models/response');
const Alert = require('../models/alert');
const Locate = require('../models/location');
const User = require('../models/user')
//setup
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

/* SEND ALERT @body.alertCode TO ALL WATCHERS IN A COMPANION SESSION
 *
 * API Endpoint: /alert/:sessionID
 * body:
 * {
 *     "alertCode": number
 * }
 * responseData: "Alert has been sent."
 */
router.post('/alert/:sessionID', async (req, res) => {
    try {
        let session = await Session.getSession(req.params.sessionID);
        let addMsgData = {"sessionID": req.params.sessionID};
        let message = Alert.createMessage(session.traveller.name, req.body.alertCode, addMsgData);
        let watcherTokens = User.getDeviceTokens(session.joinedWatchers);
        Alert.sendNotifications(watcherTokens, message);
        res.status(200).send(new Response(200, "", "Alert has been sent."));
    }
    catch(err) {
        console.log(err);
        res.status(500).send(new Response(500, err, ""));
    }
});

/* SEND ALERT @body.alertCode TO ALL USERS NEARBY @body.userID
 * body:
 * {
 *     "userID": string
 *     "alertCode": number
 * }
 * responseData: "Alert has been sent"
 */
router.post('/alert', async (req, res) => {
    try
    {
        let user = await User.getUser(req.body.userID);
        let userLoc = await Locate.getUserLocation(user.userID);
        let nearbyUsers = await Locate.getNearbyUsers(userLoc, user.preferences.proximity);
        let addMsgData = {"userName": user.userName, "userLoc": userLoc};
        let message = Alert.createMessage(user.userName, req.body.alertCode, addMsgData);
        let tokens = User.getDeviceTokens(nearbyUsers);
        Alert.sendNotifications(tokens, message);
        res.status(200).send(new Response(200, "", "Alert has been sent."));
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(new Response(500, err, ""));
    }
});

module.exports.router = router;
