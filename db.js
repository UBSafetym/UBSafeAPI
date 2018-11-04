// db.js
const admin = require('firebase-admin');

var serviceAccount = require('./credentials/ubsafe-a816e-firebase-adminsdk-48cra-6af087f053.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
module.exports = db;
