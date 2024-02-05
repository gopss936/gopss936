const admin = require('firebase-admin');

const serviceAccount =  require('../../config/firebaseConfig.json');
const { response } = require('express');

admin.initializeApp ({
    credential:admin.credential.cert(serviceAccount),
    databaseURL: 'https://PROJECT_ID.firebaseio.com' 
});


async function pushNotification(deviceToken,title,body){


    const message = {
        data: {
          title: title,
          body: body,
        },
        token: deviceToken,
      };
    
      try {
        const response = await admin.messaging().send(message);
        console.log('In-app notification sent successfully:', response);
      } catch (error) {
        console.error('Error sending in-app notification:', error);
      }
    }
    
    //  const message = {
    //     notification:{
    //         inAppNotification: 'true',
    //         title:title,
    //         body:body
    //     },
    //     token:deviceToken
    // };

    // admin.messaging().send(message).then(response =>{
    //     console.log('push notification send successfully',response)
    // }).catch(error =>{
    //     console.log('Error sending push notification',error)
    // })

 
module.exports = {
    pushNotification
}