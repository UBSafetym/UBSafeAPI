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

        var expectedResult =
            {
                "age": 80,
                "gender": "Other",
                "rating": 3.375,
                "userID": "MatchingCompanion",
                "userName": "MatchingCompanion"
            };

        var testUserLoc = new firebase.firestore.GeoPoint(37.79, -122.41);
        var loc = {
            coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)
        };
        await User.db.collection('users').doc('RecommendationsRequestor').set(testUsers[0]);
        await User.db.collection('users').doc('MatchingCompanion').set(testUsers[1]);
        await User.db.collection('users').doc('OldUser').set(testUsers[2]);
        await User.db.collection('users').doc('MaleUser').set(testUsers[3]);
        await User.db.collection('users').doc('FemaleUser').set(testUsers[4]);
        await User.db.geo.set('RecommendationsRequestor', loc);
        await User.db.geo.set('MatchingCompanion', loc);
        await User.db.geo.set('OldUser', loc);
        await User.db.geo.set('MaleUser', loc);
        await User.db.geo.set('FemaleUser', loc);
        return await Recommendation.getRecommendations('RecommendationsRequestor').then(users => {expect(users).toContainEqual(expectedResult)});
    });

    it('getRecommendations() Failure', async () => {
        return Recommendation.getRecommendations('non-existantUser').then().catch(err => {expect(err).toEqual(new Error("Error getting user's recommended Companions."))});
    });
});

