const db = require('../db').db;

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

function getAvgRating(ratingHistory)
{
    if(ratingHistory.length)
    {
        let sum, avg = 0;
        sum = ratingHistory.reduce((a,b) => {return a + b});
        avg = sum/ratingHistory.length;
        return avg;
    }
    return -1;
}

function getUserProfiles(users)
{
    let profiles = [];
    users.forEach(u => {
        profiles.push(new UserProfile(u));
    });
    return profiles;
}

function getDeviceTokens(users)
{
    let tokens = [];
    users.forEach(u => {
        tokens.push(u.deviceToken);
    });
    return tokens;
}

function UserProfile(user) {
    this.userID = user.userID;
    this.userName = user.userName;
    this.age = user.age;
    this.gender = user.gender;
    this.rating = user.rating;
}

module.exports = {
    "getUser": getUser,
    "getAvgRating": getAvgRating,
    "getUserProfiles": getUserProfiles,
    "getDeviceTokens": getDeviceTokens
}

