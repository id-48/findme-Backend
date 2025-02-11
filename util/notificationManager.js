const FCM = require('fcm-node');
const nodemailer = require('nodemailer');
const User = require('../server/user/user.model');
const Notification = require("../server/notification/notification.model");

const config = require("../config")

const serverKey = config.FCM_SERVER_KEY;
const fcm = new FCM(serverKey);

const transporter = nodemailer.createTransport({
  port:465,
  secure: true,
  auth: {
    user: 'cartoonmoza@gmail.com',
    pass: 'alrl srdy odbx tihg'
  }
});

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

const sendEmailNotification = async (receiverEmail, subject, message) => {
  const mailOptions = {
    from: 'cartoonmoza@gmail.com',
    to: receiverEmail,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Error sending email notification:', error);
    } else {
      console.log('Email notification sent:', info.response);
    }
  });
};


async function getUserDeviceToken(senderId) {
  try {
    const user = await User.findById(senderId);
    if (!user.fcmToken) {
      console.log('FCM token not found for the user');
      return null;
    }
    
    return user.fcmToken;

  } catch (error) {
    console.error('Error fetching user device token:', error);
    throw error;
  }
}

const addNotification = async (profileImage, userId, description) => {
  try {
    const newNotification = new Notification({
      profileImage: profileImage || "" ,
      userId: userId || "",
      description: description,
      isRead: false,
    });

    await newNotification.save();
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};



module.exports = {
  sendNotification,
  sendEmailNotification,
  addNotification
};
