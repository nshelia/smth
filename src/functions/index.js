const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();
const { sendMail, generateTemplate } = require('./utils/email');
const { validateFirebaseIdToken } = require('./utils/auth');
const { getUserByEmail } = require('./utils/user');
const { getCompanyById } = require('./utils/company');
const { createInviteNotification } = require('./utils/notification');
admin.initializeApp();

app.use(cors);
app.use(cookieParser);
app.use('/invite', validateFirebaseIdToken);

const rand = function () {
  return Math.random().toString(36).substr(2);
};

const token = function () {
  return rand() + rand(); // to make it longer
};

app.post('/invite', async (req, res) => {
  const dest = req.body.email;
  const companyId = req.body.companyId;

  const firestore = admin.firestore();

  const company = await getCompanyById(companyId);
  const user = await getUserByEmail(req.body.email);
  if (user.docs.length) {
    if (user.docs[0].data().role === 'company_recruiter') {
      res.status(400).send({ message: 'User is already in a organization' });
      return;
    }
  }

  const companyDoc = company.data();

  const urlToken = token();

  if (user.docs.length) {
    await createInviteNotification(req.body.email, companyDoc.name, urlToken);
  }

  await firestore.collection('invites').doc(urlToken).set({
    urlToken,
    company: companyDoc,
    invitedEmail: dest,
  });

  const mailOptions = await generateTemplate(dest, companyDoc.name, urlToken);
  const messageId = await sendMail(mailOptions);

  return res.status(200).send(messageId);
});

app.get('/invite/:inviteToken', async (req, res) => {
  const token = req.params.inviteToken;
  const firestore = admin.firestore();
  try {
    const doc = await firestore.collection('invites').doc(token).get();
    if (!doc.exists) {
      res.send('No such document!');
    } else {
      res.send(doc.data());
    }
  } catch (e) {
    res.send('error');
  }
});

app.get('/users/validate', async (req, res) => {
  const field = req.query.field;
  const value = req.query.value;

  const firestore = admin.firestore();
  try {
    const snapshot = await firestore
      .collection('users')
      .where(field, '==', value)
      .get();
    if (!snapshot.empty) {
      res.status(403);
      res.send({ message: `Record exists` });
    } else {
      if (field === 'email') {
        const valid = /^\S+@\S+$/.test(value);
        if (!valid) {
          res.status(403);
          res.send({ message: 'Invalid email' });
          return;
        } else {
          res.send({ validatedValue: value });
          return;
        }
      }
      res.send({ validatedValue: value });
    }
  } catch (e) {
    res.status(500);
    res.send({ message: 'Server error' });
  }
});

exports.app = functions.https.onRequest(app);
