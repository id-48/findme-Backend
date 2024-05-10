const FCM = require('fcm-node');
const User = require('../server/user/user.model');
const config = require("../config")
const serverKey = config.FCM_SERVER_KEY;
const fcm = new FCM(serverKey);

const sendNotification = async (senderId, message, slug) => {
   const receiverFCMToken = await getUserDeviceToken(senderId);

   if (!receiverFCMToken) {
     console.error('Receiver FCM token not found.');
     return;
   }

  const messageObject = {
    to: receiverFCMToken,
    notification: {
      title: 'Findme',
      body: message,
    },
    data:{
      slug: slug
    }
  };

  fcm.send(messageObject, (err, response) => {
    if (err) {
      console.error('Error sending notification:', err);
    } else {
      console.log('Notification sent successfully:', response);
    }
  });
};


async function getUserDeviceToken(senderId) {
  try {
    const user = await User.findById(senderId);

    if (!user) {
      console.log('User not found');
      return null;
    }

    if (!user.fcmToken) {
      console.log('FCM token not found for the user');
      return null;
    }

    console.log("collection find fcm",user.fcmToken);

    return user.fcmToken;

  } catch (error) {
    console.error('Error fetching user device token:', error);
    throw error;
  }
}


module.exports = {
  sendNotification,
};
