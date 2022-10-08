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
const sendMailHandler = require('./routes/sendDeclineMail');
const sendDeclineHandler = require('./routes/sendDeclineMail');
const sendAcceptHandler = require('./routes/sendAcceptMail');
const calculatePriceHandler = require('./routes/calculatePrice');
admin.initializeApp();

app.use(cors);
app.use(cookieParser);

app.post('/send-email', sendMailHandler);

app.post('/send-decline-email', sendDeclineHandler);

app.post('/send-accept-email', sendAcceptHandler);

app.post('/calculate-price', calculatePriceHandler)

exports.app = functions.https.onRequest(app);
