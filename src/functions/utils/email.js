const { google } = require('googleapis');
const credentials = require('../creds.json');
const fs = require('fs');
const handlebars = require('handlebars');
const tokens = require('./token.json');
const MailComposer = require('nodemailer/lib/mail-composer');

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      callback(err);
      throw err;
    } else {
      callback(null, html);
    }
  });
};

const getGmailService = () => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );
  oAuth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async (options) => {
  const gmail = getGmailService();
  const rawMessage = await createMail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
    },
  });
  return id;
};

const generateTemplate = (dest, companyName, urlToken) => {
  return new Promise((resolve, reject) => {
    readHTMLFile(__dirname + '/template.html', function (err, html) {
      console.log(err);
      const template = handlebars.compile(html);
      const replacements = {
        urlToken,
      };
      const htmlToSend = template(replacements);

      resolve({
        from: 'Greetle.app <hello@greetle.app>',
        to: dest,
        subject: 'You are invited by ' + companyName,
        html: htmlToSend,
      });
    });
  });
};

module.exports = {
  sendMail,
  generateTemplate,
};
