const firebase = require('firebase-admin');

let userArray = [
    {
        "userName": "Traveller",
        "ratingHistory": [1,3,2,4,7,5,0,5],
        "userID": "RecommendationsRequestor",
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
        "deviceToken": "TestUserDeviceToken2"
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
        "deviceToken": "TestUserDeviceToken"
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
        "deviceToken": "TestUserDeviceToken"
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
        "deviceToken": "TestUserDeviceToken"
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
        "deviceToken": "TestUserDeviceToken"
    }
];

module.exports = {
    "userArray": userArray
}
