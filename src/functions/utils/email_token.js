// token.js

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require('../creds.json');

// Replace with the code you received from Google
const code =
  '4/0AdQt8qipDNudc9D2kpBfe9weVecusxJFBZQqbrXY3-lpkrV60fu7IYEohDtfrscKuSa-Lg';
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0],
);

oAuth2Client.getToken(code).then(({ tokens }) => {
  const tokenPath = path.join(__dirname, 'token.json');
  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
  console.log('Access token and refresh token stored to token.json');
});
