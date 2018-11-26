const firebase = require('firebase-admin');

let userArray = [
    {
        "userName": "Traveller",
        "ratingHistory": [1,3,2,4,7,5,0,5],
        "userID": "Traveller",
        "gender": "Other",
        "rating": 3.375,
        "age": 80,
        "preferences": {
            "female": false,
            "male": false,
            "proximity": 5,
            "other": true,
            "ageMax": 80,
            "ageMin": 0
        },
        "deviceToken": "TravellerDeviceToken"
    },
    {
        "userName": "MatchingCompanion",
        "ratingHistory": [1,3,2,4,7,5,0,5],
        "userID": "MatchingCompanion",
        "gender": "Other",
        "rating": 3.375,
        "age": 80,
        "preferences": {
            "female": true,
            "male": false,
            "proximity": 5,
            "other": true,
            "ageMax": 80,
            "ageMin": 0
        },
        "deviceToken": "MatchingCompanionDeviceToken"
    },

    {
        "userName": "OldUser",
        "ratingHistory": [1,3,2,4,7,5,0,5],
        "userID": "OldUser",
        "gender": "Female",
        "rating": 3.375,
        "age": 100,
        "preferences": {
            "female": true,
            "male": false,
            "proximity": 5,
            "other": true,
            "ageMax": 80,
            "ageMin": 0
        },
        "deviceToken": "OldUserDeviceToken"
    },

    {
        "userName": "MaleUser",
        "ratingHistory": [1,3,2,4,7,5,0,5],
        "userID": "MaleUser",
        "gender": "Male",
        "rating": 3.375,
        "age": 80,
        "preferences": {
            "female": true,
            "male": false,
            "proximity": 5,
            "other": true,
            "ageMax": 80,
            "ageMin": 0
        },
        "deviceToken": "MaleUserDeviceToken"
    },
    {
        "userName": "FemaleUser",
        "ratingHistory": [1,3,2,4,7,5,0,5],
        "userID": "FemaleUser",
        "gender": "Female",
        "rating": 3.375,
        "age": 20,
        "preferences": {
            "female": true,
            "male": false,
            "proximity": 5,
            "other": true,
            "ageMax": 80,
            "ageMin": 0
        },
        "deviceToken": "FemaleUserDeviceToken"
    }
];

let sessionRequest = {
	"travellerID": "Traveller",
	"watcherIDs": ["FemaleUser", "MaleUser"],
	"travellerDest": new firebase.firestore.GeoPoint(0, 0), 
	"travellerSource": new firebase.firestore.GeoPoint(0, 0),
	"travellerLocation": new firebase.firestore.GeoPoint(0, 0),
	"lastUpdated": 0
};

let sessionOracle = {
	"id": "SuUjbfoBlVzTW1y4a0XM",
	"data": {
	    "traveller": {
		"id": "Traveller",
		"name": "Traveller",
		"deviceToken": "TravellerDeviceToken"
	    },
	    "travellerSource": new firebase.firestore.GeoPoint(0,0),
	    "travellerDest": new firebase.firestore.GeoPoint(0,0),
	    "travellerLoc": new firebase.firestore.GeoPoint(0,0),
	    "lastUpdated": 0,
	    "joinedWatchers": [],
	    "active": true
	}
};


module.exports = {
        "userArray": userArray,
	"sessionRequest": sessionRequest,
	"sessionOracle": sessionOracle
}
