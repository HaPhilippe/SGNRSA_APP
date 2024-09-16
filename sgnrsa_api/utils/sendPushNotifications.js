const { Expo } = require('expo-server-sdk')
let expo = new Expo()
const axios = require('axios').default

module.exports = async function sendPushNotifications(tokens, title, body, data, moreOptions = {}) {
    await Promise.all(tokens.map(async token => {
        const res = await axios.post('https://exp.host/--/api/v2/push/send', {
            to: token,
            sound: "default",
            title: title,
            body: body,
            data,
            ...moreOptions
        })
        const chuck = res.data
        // console.log(chuck)
    }))
    return false
    let notifications = [];
    for (let pushToken of tokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        notifications.push({
            to: pushToken,
            sound: "default",
            title: title,
            body: body,
            data,
            ...moreOptions
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
            } catch (error) {
                console.error(error);
                // if(error.code == 'PUSH_TOO_MANY_EXPERIENCE_IDS') {
                //           sendPushNotifications(error.details['@dukizwe/psr-app'], title, body, data)
                // }
            }
        }
    })();
};