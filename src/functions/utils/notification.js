const admin = require('firebase-admin');

async function createNotication(data) {
  const firestore = admin.firestore();
  const notificationRef = await firestore.collection('notifications').doc();
  await notificationRef.set({
    id: notificationRef.id,
    ...data,
  });
}

function createInviteNotification(email, companyName, urlToken) {
  return createNotication({
    title: `Invitation from ${companyName}`,
    description: 'Become part of the organization by submitting button below',
    notificationType: 'invite',
    email,
    buttons: [
      {
        name: 'Join organization',
        type: 'accept',
        href: `https://greetle.app/join/${urlToken}`,
      },
      {
        name: 'Dismiss',
        type: 'decline',
        href: '',
      },
    ],
  });
}

module.exports = { createNotication, createInviteNotification };
