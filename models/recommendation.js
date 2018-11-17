const geo = require('../db').geo;
const admin = require('firebase-admin');
const db = require('../db').db;
const User = require('../models/user');
const Recommendation = require('../models/recommendation');

/* Retrieves a list of nearby users - asynchronous, returns a promise */
async function getRecommendations(userID)
{
    return new Promise(async (resolve, reject) => {
        getUserLocation(userID)
            .then( userLoc => {
                User.getUser(userID).then( user => {
                    //we now have the user's coordinates and the user's preferred proximity
                    var recommendations = [];
                    const geoQuery = geo.query({
                        center: userLoc,
                        radius: user.preferences.proximity
                    });
                    geoQuery.on("key_entered", function(key, location, distance) {
                        User.getUser(key).then(user => {
                            let userProfile = new UserProfile(user);
                            recommendations.push(userProfile);
                        }).catch(err => reject(err));
                    });
                    geoQuery.on("ready", function(){
                        geoQuery.cancel();
                        recommendations = filterRecommendations(userID, user.preferences, recommendations);
                        resolve(recommendations);
                    });
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        });
}

function filterRecommendations(travellerID, preferences, nearbyUsers)
{
    var users =  nearbyUsers.filter(user => matchesPreferences(travellerID, preferences, user));
    users.slice(0, 100);
    users.sort(user => user.rating);
    return users;
}

function matchesPreferences(travellerID, preferences, user)
{
    //prevent the traveller from getting themselves as a recommendation
    if(user.userID == travellerID)
    {
        return false;
    }
    if(user.age < preferences.ageMin || user.age > preferences.ageMax)
    {
        return false;
    }
    if(preferences.female && user.gender == 'Female')
    {
        return true;
    }
    if(preferences.male && user.gender == 'Male')
    {
        return true;
    }
    if(preferences.other && user.gender == 'Other')
    {
        return true;
    }
    return false;
}

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

function UserProfile(user) {
    this.userID = user.userID;
    this.age = user.age;
    this.gender = user.gender;
    this.rating = user.rating;
}

module.exports.getRecommendations = getRecommendations;

