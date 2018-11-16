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


const TERMINATED = 0;
const REACHED_DESTINATION = 1;
const MOVING_AWAY = 2;
const ALARM_TRIGGERED = 3;
const STAGNANT = 4;
const CONNECTION_LOST = 5;
const ALERT_NEARBY_USERS = 6;

/*
 * param: CompanionSessionID
 * {
 *     "sessionID": string,
 *     "alarmType": number
 * }
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

/*
 * Retrieves and returns a companion session from the db
 */
async function getCompanionSession(sessionID)
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

function Alert(deviceToken, message, session)
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

module.exports.router = router;
