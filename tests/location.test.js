const firebase = require('firebase');
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
    const GeoFirestore = require('geofirestore').GeoFirestore;
    const MockFirebase = require('mock-cloud-firestore');
    const db = new MockFirebase(fixtureData).firestore();
    const collectionRef = db.collection('users_location');
    db.geo = new GeoFirestore(collectionRef);

    return db;
});

const User = require('../models/user');
const Location = require('../models/location');

test("gets a user's location", async () => {
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
                "coordinates": new firebase.firestore.GeoPoint(37.79, -122.41)
            },
            "g": "9p8yyrry8q",
            "l": new firebase.firestore.GeoPoint(37.79, -122.41)
        };
        var testUserLoc = new firebase.firestore.GeoPoint(37.79, -122.41);
        var loc = {coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)};
        var proximity = 5;
        let newUser = await User.db.collection('users').doc('testUser').set(testUser);
        let newUserLocation = await User.db.geo.set('testUser', loc);
        return await Location.getUserLocation('testUser').then(res => {
            console.log(res);
            expect(res).toEqual(testUserLoc);
        });
});
describe('location.js tests', function () {
    it('gets nearby users', async () => {
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
                "coordinates": new firebase.firestore.GeoPoint(37.79, -122.41)
            },
            "g": "9p8yyrry8q",
            "l": new firebase.firestore.GeoPoint(37.79, -122.41)
        };
        var testUserLoc = new firebase.firestore.GeoPoint(37.79, -122.41);
        var loc = {coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)};
        var proximity = 5;
        let newUser = await User.db.collection('users').doc('testUser').set(testUser);
        let newUserLocation = await User.db.geo.set('testUser', loc);
        return Location.getNearbyUsers(testUserLoc, proximity).then(users => {
            expect(users).toEqual(testUsers)
        }).catch(err => {console.log(err);});
    })


});

