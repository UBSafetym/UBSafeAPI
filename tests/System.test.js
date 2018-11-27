require('iconv-lite').encodingExists('utf8'); 
require('iconv-lite/encodings');

jest.mock('../db.js', () => {
    const db = require('./test_db');
    return db;
});
jest.setTimeout(30000);

const db = require('../db.js');
const firebase = require('firebase-admin');
const request = require('supertest');
const app = require('../app.js');
const TestData = require('./testdata.js');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var sessionID;
beforeAll(async () => {
	await TestData.userArray.forEach(async (user) => {
		await db.collection('users').doc(user.userID).set(user);
	});
	let createSessionResponse = await 
        request(app)
            .post('/companionsession')
            .send(TestData.sessionRequest)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
	    .expect(200);
	sessionID = createSessionResponse.body.responseData.id;
	return;
});

describe('System/API Endpoint Tests', function () {
    it('creates a companion session, allows a watcher to join, alerts said watchers, and then submits a new rating to all session watchers', async function () {
	let createSessionResponse = await 
        request(app)
            .post('/companionsession')
            .send(TestData.sessionRequest)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
	    .expect(200);
	let sessionID = createSessionResponse.body.responseData.id;

	let joinResponse = await 
        request(app)
            .put('/companionsession/join')
            .send({ "sessionID": sessionID, "watcherID": "MatchingCompanion" })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
	    .expect(200);
	
	let alertSessionResponse = await
			request(app)
			    .post('/alert/' + sessionID)
			    .send({
				"alertCode": 0
			    })
			    .expect(200);
	let rateSessionResponse = await
	    request(app)
            .post('/companionsession/' + sessionID + '/rate')
            .send({ "rating": 4 })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
	    .expect(200);
    });
    it('alerts nearby users', async function () {
        let response = 
	    await request(app)
            .post('/alert')
            .send({
                "userID": "LocationTestUserID",
                "alertCode": 6  
            })
	    .expect(200);
    });
    it('throws an error on POST /companionsession with invalid request body', async function () {
	let response = await 
        request(app)
            .post('/companionsession')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
	    .expect(404);
    });
    it('throws an error on PUT /companionsession/join with invalid request', async function () {
    let joinResponse = await 
        request(app)
            .put('/companionsession/join')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
	    .expect(404);    
    });
    it('throws an error on PUT /companionsession/:sessionID/rate with invalid rating', async function () {
	let response = await 
        request(app)
            .post('/companionsession/' + sessionID + '/rate')
            .send({"rating": 10})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
	    .expect(404);
    });
    it('throws an error on POST /alert/:sessionID with invalid sessionID', async function () {
	let response = await 
        request(app)
            .post('/alert/' + 'invalidSessionID')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
	    .expect(404);
    });
    it('throws an error on POST /alert with invalid id', async function () {
        let response = 
	    await request(app)
            .post('/alert')
            .send({
                "userID": "invalidID",
                "alertCode": 6  
            })
	    .expect(404);
    });
});
