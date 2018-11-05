// db.js
const admin = require('firebase-admin');
const settings = {timestampsInSnapshots: true};

var serviceAccount = require('./credentials/ubsafe-a816e-firebase-adminsdk-48cra-6af087f053.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
db.settings(settings);
module.exports = db;
