const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();
const {
  sendMail,
  generateTemplate,
  generateTemplateForDeclined,
  generateTemplateForAccept,
} = require('./utils/email');
const calculatePrice = require('./routes/calculatePrice');

admin.initializeApp();

app.use(cors);
app.use(cookieParser);

app.post('/send-email', async (req, res) => {
  const dest = 'nshprimary@gmail.com';
  const documentId = req.body.documentId;
  const make = req.body.make;

  const firestore = admin.firestore();

  const doc = await firestore.collection('requests').doc(documentId).get();
  if (!doc.exists) {
    res.send('No such document!');
    return;
  }

  const mailOptions = await generateTemplate(dest, make, documentId);
  const messageId = await sendMail(mailOptions);
  return res.status(200).send(messageId);
});

app.post('/send-decline-email', async (req, res) => {
  const dest = req.body.email;
  const make = req.body.make;
  const comments = req.body.comments;
  const declinedImages = req.body.declinedImages;
  const mailOptions = await generateTemplateForDeclined(dest, make, comments);

  const messageId = await sendMail(mailOptions);
  return res.status(200).send(messageId);
});

app.post('/send-accept-email', async (req, res) => {
  const dest = req.body.email;
  const make = req.body.make;
  const finalPrice = req.body.finalPrice;
  const mailOptions = await generateTemplateForAccept(dest, make, finalPrice);

  const messageId = await sendMail(mailOptions);
  return res.status(200).send(messageId);
});

app.post('/calculate-price', calculatePrice);

exports.app = functions.https.onRequest(app);
