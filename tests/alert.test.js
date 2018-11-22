
jest.mock('../db.js', () => {
    const db = require('./test_db');
    return db;
});

const Expo = require('expo-server-sdk').Expo;
const Alert = require('../models/alert');

describe('alert.js tests', function () {
    it ("setNotifications() Success", async () => {
        var tokens = [
            "ExponentPushToken[si1JbhFlVLoCFLbxqaKoFn]" //lisa's push token
        ];
        var msg = {
            "body": "Test notification.",
            "data": {"alertCode": 0}
        };
        Alert.sendNotifications(tokens, msg).then(r => {expect(r).toContainEqual(
            expect.objectContaining( [{ "id": expect.anything(), "status": "ok" }] )
        )});
    });

    it ("setNotifications() Failure", async () => {
        return await Alert.sendNotifications(["843wp9u63qau"], {}).then().catch(err => {expect(err).toEqual(new Error('Invalid device token.'))});
    });

    test("createMessage() with alertCode 0", () => {
        var expectedResponse = {
            "body": "testName has terminated the Virtual Companion Session.",
            "data": {"alertCode": 0}
        };
        expect(Alert.createMessage("testName", 0, null)).toEqual(expectedResponse);
    });

    test("createMessage() with alertCode 1", () => {
        var expectedResponse = {
            "body": "testName has reached their destination!",
            "data": {"alertCode": 1}
        };
        expect(Alert.createMessage("testName", 1, null)).toEqual(expectedResponse);
    });

    test("createMessage() with alertCode 2", () => {
        var expectedResponse = {
            "body": "testName is moving away from their location!",
            "data": {"alertCode": 2}
        };
        expect(Alert.createMessage("testName", 2, null)).toEqual(expectedResponse);
    });

    test("createMessage() with alertCode 3", () => {
        var expectedResponse = {
            "body": "testName has triggered an emergency alarm!",
            "data": {"alertCode": 3}
        };
        expect(Alert.createMessage("testName", 3, null)).toEqual(expectedResponse);
    });

    test("createMessage() with alertCode 4", () => {
        var expectedResponse = {
            "body": "testName has not moved in 5 minutes!",
            "data": {"alertCode": 4}
        };
        expect(Alert.createMessage("testName", 4, null)).toEqual(expectedResponse);
    });

    test("createMessage() with alertCode 5", () => {
        var expectedResponse = {
            "body": "Lost connection with testName!",
            "data": {"alertCode": 5}
        };
        expect(Alert.createMessage("testName", 5, null)).toEqual(expectedResponse);
    });

    test("createMessage() with alertCode 6", () => {
        var expectedResponse = {
            "body": "testName is nearby and might be in trouble!",
            "data": {
                "alertCode": 6,
                "userLoc": "testLoc",
                "userName": "testName"
            }
        };
        var additionalData = {
            "userLoc": "testLoc",
            "userName": "testName"
        }
        expect(Alert.createMessage("testName", 6, additionalData)).toEqual(expectedResponse);
    });

    test("createMessage() with alertCode 7", () => {
        var expectedResponse = {
            "body": "testName has invited you to their Virtual Companion Session!",
            "data": {
                "alertCode": 7,
                "id": "testID",
                "data": "testData"
            }
        };
        var additionalData = {
            "id": "testID",
            "data": "testData"
        }
        expect(Alert.createMessage("testName", 7, additionalData)).toEqual(expectedResponse);
    });

    test("createMessage() with alertCode 8", () => {
        var expectedResponse = {
            "body": "testName has joined your Companion Session!",
            "data": {"alertCode": 8}
        };
        expect(Alert.createMessage("testName", 8, null)).toEqual(expectedResponse);
    });

    it('createMessage() default error', () => {
        //return Alert.createMessage().then().catch();
        expect(() => {Alert.createMessage()}).toThrow();
        //return Alert.createMessage().then().catch(err => {expect(err).toEqual(new Error("Invalid alert code!"))});
    });
});

