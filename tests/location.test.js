jest.mock('../db.js', () => {
    const fixtureData = {
         __collection__: {
        users: {
          }
        },
         __collection__: {
        users_location: {
            
          }
        },
         __collection__: {
        companion_sessions: {
          }
        }
      }
    const MockFirebase = require('mock-cloud-firestore');
    const db = new MockFirebase(fixtureData).firestore();
    return db;
});

const User = require('../models/user');
const Location = require('../models/location');

describe('location.js tests', function () {
    it('getNearbyUsers() Success', async () => {
        let testUsers = [
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
        var testUser = {
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
        };
        var testUserLocation = {
            "d": {
                "coordinates": [37.79, -122.41]
            },
            "g": "9p8yyrry8q",
            "l": [37.79, -122.41]
        };
        var loc = [37.79, -122.41];
        var proximity = 5;
        let newUser = await User.db.collection('users').doc('testUser').set(testUser);
        let newUserLocation = await User.db.collection('user_locations').doc('testUser').set(testUserLocation);
        return await Location.getNearbyUsers(loc, proximity).then(users => {expect(users).toEqual(testUsers)});
    })
});