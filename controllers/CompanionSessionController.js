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
var getUser = require('./RecommendationController').getUser;

router.post('/companionsession/addWatcher/:sessionID', (req, res) => {
    /*
     * - Create the companion session
     *   > get and store each watcher's device id
     * - Send the invites
     * - return the companion session id
     */
    //db.collection('companionSessions').add().then().catch();
});

/*
 * API Endpoint: POST /companionsessions + body:
 * {
 *     "travellerID": INSERT_TRAVELLERS_USERID,
 *     "watcherIDs": [ARRAY_OF_WATCHER_USERIDS],
 *     "travellerDest": geopoint,
 *     "travellerSource": geopoint,
 *     "travellerLocation": geopoint,
 * }
 */
router.post('/companionsession', async (req, res) => {
    createCompanionSession(req.body).then(session => {
        sendInvites(req.body.watcherIDs, session);
        res.status(200).send(new Response(200, "", {"sessionID": session.id}));
    }).catch(err => {
        console.log(err);
        res.status(500).send(new Response(500, err, ""));
    });
});

async function createCompanionSession(session)
{
    //console.log("createCompanionSession():");
    //console.log(session);
    return new Promise(async (resolve, reject) => {
        getUser(session.travellerID).then( traveller => {
            //post the new companion session to the db
            var newSession = makeCompanionSession(traveller, session);
            console.log(newSession);
            db.collection('companionSessions')
                .add(newSession)
                .then(sessionRef => {
                    resolve({"id": sessionRef.id, "data": newSession});
                }).catch(err => reject(err));
        }).catch(err => reject(err));
    });
}

async function getDeviceTokens(watcherIDs)
{
    return new Promise(async (resolve, reject) => {
        let tokens = [];
        let numRetrieved = 0;
        for(var i = 0; i < watcherIDs.length; i++)
        {
            getUser(watcherIDs[i]).then(watcher => {
                tokens.push(watcher.deviceToken);
                numRetrieved++;
                if(numRetrieved == watcherIDs.length)
                {
                    resolve(tokens);
                }
            }).catch(err => reject(err));
        }
    });
}

async function sendInvites(watcherIDs, session)
{
    getDeviceTokens(watcherIDs).then(tokens => {
        let expo = new Expo();
        let invites = createInvites(tokens, session);
        let chunks = expo.chunkPushNotifications(invites);
        let tickets = [];
        for(let chunk of chunks)
        {
            expo.sendPushNotificationsAsync(chunk).then(ticketChunk => {
                tickets.push(ticketChunk);
            }).catch(err => console.error(error));
        }
    }).catch(err => console.error(err));
}

function createInvites(tokens, session)
{
    let invites = [];
    for(let token of tokens)
    {
        if(!Expo.isExpoPushToken(token))
        {
            console.error('Push token ${token} is not a valid Expo push token');
            continue;
        }
        invites.push(new SessionInvite(token, session));
    }
    return invites;
}

function SessionInvite(deviceToken, session)
{
    this.to = deviceToken;
    this.sound = 'default';
    this.body = session.data.traveller.name + "has invited you to a Virtual Companion Session!";
    this.data = {
        "sessionID": session.id,
        "travellerName": session.data.traveller.name,
        "source": session.data.travellerSource,
        "dest": session.data.travellerDest
    }
}

//get the user object and format the traveller object
//get the watchers and store their information correctly
function makeCompanionSession(traveller, session)
{
    var date = new Date();
    var newSession = {};
    newSession.traveller = makeTraveller(traveller);
    newSession.travellerSource = session.travellerSource;
    newSession.travellerDest = session.travellerDest;
    newSession.travellerLoc = session.travellerLocation;
    newSession.lastUpdated = date.getHours();
    newSession.joinedWatchers = [];
    return newSession;
}

function makeTraveller(traveller)
{
    var ret = {};
    //console.log("Traveller:");
    //console.log(traveller);
    ret.id = traveller.UserID;
    ret.name = traveller.UserName;
    ret.deviceToken = traveller.DeviceToken;
    return ret;
}

function Watcher(watcher)
{
    this.id = watcher.UserID;
    this.name = watcher.Name;
    this.deviceToken = watcher.deviceToken;
}


function Response(code, err, data)
{
    this.status = code;
    this.errorMessage = err.message;
    this.responseData = data;
}

module.exports.router = router;


/*
{
    "traveller": {
        "userID": string,
        "name": string,
        "deviceToken": string
        "source": geopoint,
        "destination": geopoint
    },
    "joinedWatchers": [
        "watcher1ID":{
            "deviceToken": string,
            "name": string
        },
        "watcher2ID":{
            "deviceToken": string,
            "name": string
        },
        "watcher2ID":{
            "deviceToken": string,
            "name": string
        }
    ]
    "travellerLoc": geopoint,
    "lastUpdated": datetime
}
*/
