//dependencies
var Expo = require('expo-server-sdk').Expo;
var admin = require('firebase-admin');
var db = require('../db').db;

var User = require('../models/user');
var Response = require('../models/response');
var Alert = require('../models/alert');
var Session = require('../models/companionsession');

const INVITED_TO_SESSION = 7;

module.exports = {

    /*
     * Retrieves and returns a companion session from the db
     */
    "getSession" : async function(sessionID)
    {
        return new Promise((resolve, reject) => {
            let sessionRef = db.collection('companion_sessions').doc(sessionID);
            let retrievedSession = sessionRef.get()
                .then(session => {
                    if(!session.exists){
                        reject("Cannot find session in the db.");
                    }
                    else{
                        resolve(session.data());
                    }
                })
                .catch(err => {
                        reject(err);
                });
        });
    },
    "createSession": async function(session)
    {
        return new Promise(async (resolve, reject) => {
            User.getUser(session.travellerID).then( traveller => {
                //post the new companion session to the db
                var newSession = makeCompanionSession(traveller, session);
                console.log(newSession);
                db.collection('companion_sessions')
                    .add(newSession)
                    .then(sessionRef => {
                        resolve({"id": sessionRef.id, "data": newSession});
                    }).catch(err => reject(err));
            }).catch(err => reject(err));
        });
    },

    "sendInvites": async function(ids, session)
    {
        try{
            let tokens = await getWatcherTokensFromIDs(ids);
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
        }
        catch(err){
            console.error(err);
        }
    }

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
    this.body = session.data.traveller.name + " has invited you to a Virtual Companion Session!";
    this.data = {
        "sessionID": session.id,
        "travellerName": session.data.traveller.name,
        "source": session.data.travellerSource,
        "dest": session.data.travellerDest,
        "alertCode": INVITED_TO_SESSION
    }
}

function makeCompanionSession(traveller, session)
{
    var date = new Date();
    var newSession = {
        "traveller" : makeTraveller(traveller),
        "travellerSource":  session.travellerSource,
        "travellerDest":  session.travellerDest,
        "travellerLoc": session.travellerLocation,
        "lastUpdated": session.lastUpdated,
        "joinedWatchers": [],
        "active": true
    };
    return newSession;
}

function makeTraveller(traveller)
{
    var newTraveller = {};
    newTraveller.id = traveller.userID;
    newTraveller.name = traveller.userName;
    newTraveller.deviceToken = traveller.deviceToken;
    return newTraveller;
}

function makeWatcher(watcher)
{
    var newWatcher = {
        "id": watcher.userID,
        "name": watcher.userName,
        "deviceToken": watcher.deviceToken
    };
    return newWatcher;
}

async function getWatcherTokensFromIDs(watcherIDs)
{
    return new Promise(async (resolve, reject) => {
        let tokens = [];
        let numRetrieved = 0;
        for(var i = 0; i < watcherIDs.length; i++)
        {
            User.getUser(watcherIDs[i]).then(watcher => {
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
