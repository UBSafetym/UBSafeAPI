//dependencies
var express = require('express');
var admin = require('firebase-admin');
var db = require('../db').db;
var geo = require('../db').geo;
//setup
var router = express.Router();

/*
 * API Endpoint: GET /recommendations/{userID}
 * - returns a list of user profiles that match the user's preferences
 */
router.get('/recommendations/:userID', async (req, res) => {
    findNearbyUsers(req.params.userID).then(recommendations => {
            res.status(200).send({errorMessage: "", responseData: recommendations});
        })
        .catch(err => {
            res.status(500).send({errorMessage: err, responseData: ""});
        });
});

/* Retrieves a list of nearby users - asynchronous, returns a promise */
async function findNearbyUsers(userID)
{
    return new Promise(async (resolve, reject) => {
        getUserLocation(userID)
            .then( userLoc => {
                getUser(userID).then( user => {
                    //we now have the user's coordinates and the user's preferred proximity
                    var recommendations = [];
                    const geoQuery = geo.query({
                        center: userLoc,
                        radius: user.Preferences.Proximity
                    });
                    geoQuery.on("key_entered", function(key, location, distance) {
                        getUser(key).then(user => {
                            let userProfile = new UserProfile(user);
                            recommendations.push(userProfile);
                        }).catch(err => reject(err));
                    });
                    geoQuery.on("ready", function(){
                        geoQuery.cancel();
                        recommendations = filterRecommendations(user.Preferences, recommendations);
                        resolve(recommendations);
                    });
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
}

function filterRecommendations(preferences, nearbyUsers)
{
    var users =  nearbyUsers.filter(user => matchesPreferences(preferences, user));
    users.slice(0, 100);
    users.sort(user => user.Rating);
    return users;
}

function matchesPreferences(preferences, user)
{
    if(user.Age < preferences.AgeMin || user.Age > preferences.AgeMax)
    {
        return false;
    }
    if(preferences.Female && user.Gender == 'Female')
    {
        return true;
    }
    if(preferences.Male && user.Gender == 'Male')
    {
        return true;
    }
    if(preferences.Other && user.Gender == 'Other')
    {
        return true;
    }
    return false;
}


router.get('/test/:userID', (req, res) => {
    geo.set(req.params.userID, { coordinates: new admin.firestore.GeoPoint(37.79, -122.41)})
        .then(doc => {
            res.status(200).send("Succeeded");
        }, (error) => {
            res.status(500).send({errorMessage: error, responseData: ""});
        });
});

async function getUserLocation(userID)
{
    return new Promise((resolve, reject) => {
        geo.get(userID)
            .then((userLoc) => {
                if(userLoc === null) reject("Unable to locate user.");
                else resolve(userLoc.coordinates);
            })
            .catch(err => reject(err))
    });
}

/*
 * Retrieves and returns a user from the db
 */
async function getUser(userID)
{
    return new Promise((resolve, reject) => {
        let user = db.collection('users').doc(userID);
        let retrievedUser = user.get()
            .then(doc => {
                if(!doc.exists){
                    reject("Cannot find user in the db.");
                }
                else{
                    resolve(doc.data());
                }
            })
            .catch(err => {
                    reject(err);
            });
    });
}


function UserProfile(user) {
    this.UserID = user.UserID;
    this.Age = user.Age;
    this.Gender = user.Gender;
    this.Rating = user.Rating;
}

module.exports.router = router;
module.exports.getUser = getUser;
