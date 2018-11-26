
jest.mock('../db.js', () => {
    const db = require('./test_db');
    return db;
});

const request = require('supertest');
const app = require('../app.js');

describe('RecommendationController.js tests', function () {
    it('get recommendations', function (done) {
        request(app)
            .get('/recommendations/testID')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    
    it('get recommendations for non-existent user', function (done) {
        request(app)
            .get('/recommendations/idisnonexisting')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500) 
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});