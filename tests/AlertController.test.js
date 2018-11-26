
jest.mock('../db.js', () => {
    const db = require('./test_db');
    return db;
});

const request = require('supertest');
const app = require('../app.js');

describe('AlertController.js tests', function () {
    it('post new alert to all users in a companion session', function () {
        request(app)
            .post('/alert/1ffXuQT9yaUp1jO8CxZj')
            .send({
                "alertCode": 0
            })
            .end(function(err, res) {
                expect(res.statusCode).toEqual(200);
                done();
            });
    });
    
    it('post new alert to one user', function () {
        request(app)
            .post('/alert')
            .send({
                "userID": "testID",
                "alertCode": 0
            })
            .end(function(err, res) {
                expect(res.statusCode).toEqual(200);
                done();
            });
    });
});
