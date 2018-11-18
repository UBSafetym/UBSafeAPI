
const User = require('../models/user');

test("gets a user's average rating from filled array", () => {
    let ratings = [0, 0, 1, 2, 3, 4, 5];
    expect(User.getAvgRating(ratings)).toBe((15/7));
});

test("gets a user's average rating from empty array", () => {
    let ratings = [];
    expect(User.getAvgRating(ratings)).toBe(-1);
});

test("produces an array of deviceTokens when given array of users", () => {
    let testUsers = [
        {
            "deviceToken": "ExponentPushToken[IHPfmxEp_y9mPS2GLki5nC]",
            "userName": "Agmel Womg",
            "userID": "10157425230694386",
            "gender": "Male",
            "age": 21,
            "preferences": {
                "proximity": -1,
                "other": true,
                "ageMax": 80,
                "ageMin": 18,
                "female": true,
                "male": true
            }
        },
        {
            "userID": "10215891348511047",
            "gender": "Male",
            "rating": 0.5,
            "age": 21,
            "preferences": {
                "ageMin": 1,
                "female": true,
                "male": true,
                "proximity": 100,
                "other": true,
                "ageMax": 55
            },
            "deviceToken": "ExponentPushToken[Z6NnYfK2C1vtqH-TsDkWT1]",
            "userName": "Cormac Mollitor",
            "ratingHistory": [
                0,
                1
            ]
        },
        {
            "ratingHistory": [
                3,
                3,
                3,
                2,
                4,
                5,
                0,
                5
            ],
            "userID": "1146564348829220",
            "gender": "Female",
            "rating": 3.125,
            "age": 21,
            "preferences": {
                "female": true,
                "male": true,
                "proximity": 2,
                "other": true,
                "ageMax": 25,
                "ageMin": 18
            },
            "deviceToken": "LisaDeviceToken",
            "userName": "Lisa Kirby"
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
    let tokens = ["ExponentPushToken[IHPfmxEp_y9mPS2GLki5nC]", "ExponentPushToken[Z6NnYfK2C1vtqH-TsDkWT1]", "LisaDeviceToken", "TestUserDeviceToken"];
    expect(User.getDeviceTokens(testUsers)).toEqual(tokens);
});

test("produces an array of profiles when given an array of users", () => {
    let testUser = {
        "ratingHistory":[1,3,2,4,7,5,0,5],
        "userID":"testID",
        "gender":"Other",
        "rating":3.375,
        "age":80,
        "preferences":
        {
            "ageMin":0,
            "female":true,
            "male":false,
            "proximity":5,
            "other":true,
            "ageMax":80
        },
        "deviceToken":"TestUserDeviceToken",
        "userName":"Test User"
    };
    let profile = {
            "userID": "testID",
            "userName": "Test User",
            "age": 80,
            "gender": "Other",
            "rating": 3.375
        };
    let userArr = [];
    userArr.push(testUser);
    expect(User.getUserProfiles(userArr).length).toBe(1);
    expect(User.getUserProfiles(userArr)[0]).toEqual(profile);
});



