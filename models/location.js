const geo = require('../db').geo;
const admin = require('firebase-admin');
const db = require('../db').db;
const User = require('../models/user');

async function getNearbyUsers(userID)
{
    try{
        let loc = await getUserLocation(userID);
        let user = await User.getUser(userID);

        const geoQuery = geo.query({
            center: loc,
            radius: user.preferences.proximity
        });

        let nearbyUsers = [];
        geoQuery.on("key_entered", async function(key, location, distance) {
            let user = await User.getUser(key);
            let userProfile = new UserProfile(user);
            nearbyUsers.push(userProfile);
        });

        geoQuery.on("ready", function(){
            geoQuery.cancel();
            return nearbyUsers;
        });
    }
    catch(err){
        return err;
    }

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
