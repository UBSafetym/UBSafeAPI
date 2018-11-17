var Expo = require('expo-server-sdk').Expo;

const TERMINATED = 0;
const REACHED_DESTINATION = 1;
const MOVING_AWAY = 2;
const ALARM_TRIGGERED = 3;
const STAGNANT = 4;
const CONNECTION_LOST = 5;
const ALERT_NEARBY_USERS = 6;
const INVITED_TO_SESSION = 7;
const JOINED_SESSION = 8;

module.exports = {
    "sendNotifications": async function(tokens, body, data)
    {
        let notifications = createNotifications(tokens, body, data);
        console.log(notifications);
        return new Promise((resolve, reject) => {
            if(notifications.length == 0)
            {
                reject("Invalid device token.");
            }
            let expo = new Expo();
            let chunks = expo.chunkPushNotifications(notifications);
            let tickets = [];
            let numSent = 0;
            for(let chunk of chunks)
            {
                expo.sendPushNotificationsAsync(chunk).then(ticketChunk => {
                        tickets.push(ticketChunk);
                        numSent++;
                        if(numSent == notifications.length)
                        {
                            resolve(tickets);
                        }
                }).catch(err => {
                    console.error(err);
                    reject(err);
                });
            }
        });
    },
    "createMessage": function(name, alertCode, )
    {
        switch(alertCode)
        {
            case TERMINATED:
                return name + " has terminated the Virtual Companion Session.";
            case REACHED_DESTINATION:
                return name + " has reached their destination.";
            case MOVING_AWAY:
                return name + " is moving away from their destination!";
            case ALARM_TRIGGERED:
                return name + " has triggered an emergency alarm!";
            case STAGNANT:
                return name + " has not moved for 5 minutes!";
            case CONNECTION_LOST:
                return "Lost connection with " + name + "!";
            case INVITED_TO_SESSION:
                return name + " has invited you to their Virtual Companion Session!";
            case JOINED_SESSION:
                return name + " has joined your Virtual Companion Session!";
            default: throw new Error("Invalid alert code!");
        }
    }
}

function Notification(deviceToken, body, data)
{
    this.to = deviceToken;
    this.sound = 'default';
    this.body = (body)? body : "";
    this.data = (data)? data : {};
}

function createNotifications(tokens, body, data)
{
    let messages = [];
    for(let token of tokens)
    {
        if(!Expo.isExpoPushToken(token))
        {
            console.error('Push token ' + token + ' is not a valid Expo push token');
            continue;
        }
        messages.push(new Notification(token, body, data));
    }
    return messages;
};

module.exports.Notification = Notification;

