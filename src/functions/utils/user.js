const admin = require('firebase-admin');

async function getUserByEmail(email) {
  const firestore = admin.firestore();

  const user = await firestore
    .collection('users')
    .where('email', '==', email)
    .get();
  return user;
}

module.exports = { getUserByEmail };
