
jest.mock('../db.js', () => {
    const db = require('./test_db');
    return db;
});

const request = require('supertest');
const app = require('../app.js');

describe('UserController.js tests', function () {
    it('get all users', function (done) {
        const response = request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
            //.expect({errorMessage: "", responseData: testResponse}, done);
    });
    
    it('get specific user', function (done) {
        request(app)
            .get('/users/testID')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    
    it('get non-existent user', function (done) {
        request(app)
            .get('/users/idisnonexisting')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500) 
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
    
    it('put user', function (done) {
        let data = {
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
        } 
        request(app)
            .put('/users/testID')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
