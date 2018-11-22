
jest.mock('../db.js', () => {
    const db = require('./test_db');
    return db;
});

jest.setTimeout(30000);

const Session = require('../models/companionsession');
const TestData = require('./testdata');
const User = require('../models/user');

describe('companionsession.js tests', function () {
    it('makeSessionProfile() makes a Session Profile when given a user object', () => {
        var oracle = {
            "id": "testID",
            "name": "Test User",
            "deviceToken": "testDeviceToken"
        };
        var testUser = {
                "userName": "Test User",
                "ratingHistory": [1,3,2,4,7,5,0,5],
                "userID": "testID",
                "gender": "Female",
                "rating": 3.375,
                "age": 20,
                "deviceToken": "testDeviceToken",
                "preferences": {
                    "female": true,
                    "male": false,
                    "proximity": 5,
                    "other": true,
                    "ageMax": 80,
                    "ageMin": 0
                }
            };
        expect(Session.makeSessionProfile(testUser)).toEqual(oracle);
    });

    it('getWatcherTokensFromIDs(): extracts an array of device tokens when given an array of user IDs', async () => {
        var oracle = [];
        var testWatcherIDs = [];
        TestData.userArray.forEach(async (user) => {
            testWatcherIDs.push(user.userID);
            oracle.push(user.deviceToken);
            await User.db.collection('users').doc(user.userID).set(user);
        });
        expect((await Session.getWatcherTokensFromIDs(testWatcherIDs)).sort()).toEqual(oracle.sort());
    });

    /*
    it('getSession(): retrieves a companion session from the database by its ID', async () => {
        var oracle = [];
        var testWatcherIDs = [];
        TestData.userArray.forEach(async (user) => {
            testWatcherIDs.push(user.userID);
            oracle.push(user.deviceToken);
            await User.db.collection('users').doc(user.userID).set(user);
        });
        expect((await Session.getWatcherTokensFromIDs(testWatcherIDs)).sort()).toEqual(oracle.sort());
    });
    */
});
