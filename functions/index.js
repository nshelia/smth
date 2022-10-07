const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();
admin.initializeApp();

app.use(cors);
app.use(cookieParser);

app.post('/calculate-price', async (req, res) => {
  const model = req.body.mdeol;
  const companyId = req.body.companyId;

  return 500;
});

exports.app = functions.https.onRequest(app);
