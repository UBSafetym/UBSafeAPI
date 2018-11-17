var admin = require('firebase-admin');
var db = require('../db').db;

module.exports = {
    "getUser": async function(userID)
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
    },
    "getAvgRating": function(ratingHistory)
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

}
