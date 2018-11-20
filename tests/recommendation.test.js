jest.mock('../db.js', () => {
    const db = require('./test_db');
    return db;
});

jest.setTimeout(30000);

const firebase = require('firebase-admin');
const User = require('../models/user');
const Recommendation = require('../models/recommendation');

describe('recommendation.js tests', function () {
    it('getRecommendations() Success', async () => {
        let testUsers = [
            {
                "userName": "Changed Test User 2",
                "ratingHistory": [
                    1,
                    3,
                    2,
                    4,
                    7,
                    5,
                    0,
                    5
                ],
                "userID": "testID2",
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
                "deviceToken": "TestUserDeviceToken2"
            },
            {
                "userName": "Changed Test User",
                "ratingHistory": [
                    1,
                    3,
                    2,
                    4,
                    7,
                    5,
                    0,
                    5
                ],
                "userID": "testID",
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
            }
        ];
        
        var expectedResult = [
            {
                "age": 80,
                "gender": "Other",
                "rating": 3.375,
                "userID": "testID2",
                "userName": "Changed Test User 2"
            }
        ];
        
        var testUserLoc = new firebase.firestore.GeoPoint(37.79, -122.41);
        var loc = {
            coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)
        };
        let newUser = await User.db.collection('users').doc('testID').set(testUsers[0]);
        let newUser2 = await User.db.collection('users').doc('testID2').set(testUsers[1]);
        let newUserLocation = await User.db.geo.set('testID', loc);
        let newUserLocation2 = await User.db.geo.set('testID2', loc);
        return await Recommendation.getRecommendations('testID').then(users => {expect(users).toEqual(expectedResult)});
    });

    it('getRecommendations() Failure', async () => {
        return Recommendation.getRecommendations('non-existantUser').then().catch(err => {expect(err).toEqual(new Error("Error getting user's recommended Companions."))});
    });
});

