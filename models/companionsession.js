const db = require('../db');
const User = require('../models/user');

function makeCompanionSession(traveller, session)
{
    var newSession = {
        "traveller" : makeSessionProfile(traveller),
        "travellerSource":  session.travellerSource,
        "travellerDest":  session.travellerDest,
        "travellerLoc": session.travellerLocation,
        "lastUpdated": session.lastUpdated,
        "joinedWatchers": [],
        "active": true
    };
    return newSession;
}

function makeSessionProfile(user)
{
    var sessionProfile = {
        "id": user.userID,
        "name": user.userName,
        "deviceToken": user.deviceToken
    };
    return sessionProfile;
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

async function getSession(sessionID)
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
}

/* Creates a Companion Session and inserts it into the db */
async function createSession(session)
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
}

module.exports = {

    "getWatcherTokensFromIDs": getWatcherTokensFromIDs,
    "getSession": getSession,
    "createSession": createSession,
    "makeSessionProfile": makeSessionProfile

}
