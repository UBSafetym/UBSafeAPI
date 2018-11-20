

jest.mock('../db.js', () => {
    const db = require('./test_db');
    return db;
});

const firebase = require('firebase-admin');
const User = require('../models/user');
const Location = require('../models/location');

describe('location.js tests', function () {
    it('getNearbyUsers() Success', async () => {
        let testUsers = [{
            "userName": "Changed Test User",
            "ratingHistory": [1, 3, 2, 4, 7, 5, 0, 5],
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
        }];
        var testUserLoc = new firebase.firestore.GeoPoint(37.79, -122.41);
        var loc = {
            coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)
        };
        let newUser = await User.db.collection('users').doc('testUser').set(testUsers[0]);
        let newUserLocation = await User.db.geo.set('testUser', loc);
        return await Location.getNearbyUsers(testUserLoc, 5).then(users => {expect(users).toEqual(testUsers)});
    });

    it('getNearbyUsers() Failure', async () => {
        var testUserLoc = new firebase.firestore.GeoPoint(37.79, -122.41);
        var loc = {
            coordinates: new firebase.firestore.GeoPoint(37.79, -122.41)
        };
        let newUserLocation = await User.db.geo.set('testUser', loc);
        return Location.getNearbyUsers(testUserLoc, 5).then().catch();
    });

    it("getUserLocation() Success", async () => {
        var testUser = {
            "userName": "Changed Test User",
            "ratingHistory": [1, 3, 2, 4, 7, 5, 0, 5],
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
            expect(res).toEqual(testUserLoc);
        });
    });

    it("getUserLocation() Failure", async () => {
        return await Location.getUserLocation('non-existantUser').then().catch(err => { expect(err).toEqual( new Error("Could not find user's location.") ) });
    });
});

