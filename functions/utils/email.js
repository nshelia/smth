const fs = require('fs');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

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

const sendMail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'mailservce9@gmail.com',
      pass: 'stefvetptzfpuvfb',
    },
  });

  await transporter.sendMail(options);
};

const generateTemplate = (dest, carMake, documentId) => {
  return new Promise((resolve, reject) => {
    readHTMLFile(__dirname + '/template.html', function (err, html) {
      const template = handlebars.compile(html);
      const replacements = {
        documentId,
        carMake,
      };
      const htmlToSend = template(replacements);

      resolve({
        from: 'CarReviewService <nshprimary@gmail.com>',
        to: dest,
        subject: 'Car review for ' + carMake,
        html: htmlToSend,
      });
    });
  });
};

const generateTemplateForDeclined = (dest, carMake, comments) => {
  return new Promise((resolve, reject) => {
    readHTMLFile(__dirname + '/declinedTemplate.html', function (err, html) {
      const template = handlebars.compile(html);
      const replacements = {
        comments,
        carMake,
      };
      const htmlToSend = template(replacements);

      resolve({
        from: 'CarReviewService <nshprimary@gmail.com>',
        to: dest,
        subject: 'Your request for' + carMake + ' has been declined',
        html: htmlToSend,
      });
    });
  });
};

const generateTemplateForAccept = (dest, carMake, finalPrice) => {
  return new Promise((resolve, reject) => {
    readHTMLFile(__dirname + '/acceptTemplate.html', function (err, html) {
      const template = handlebars.compile(html);
      const replacements = {
        finalPrice,
        carMake,
      };
      const htmlToSend = template(replacements);

      resolve({
        from: 'CarReviewService <nshprimary@gmail.com>',
        to: dest,
        subject: 'Your request for' + carMake + ' has been accepted',
        html: htmlToSend,
      });
    });
  });
};

module.exports = {
  sendMail,
  generateTemplate,
  generateTemplateForDeclined,
  generateTemplateForAccept,
};
