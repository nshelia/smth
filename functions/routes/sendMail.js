const { sendMail, generateTemplate } = require('../utils/email');

async function sendMailFunc(req, res) {
  // THIS IS EMAIL OF EXPERT
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
  console.log('came here', dest, make, mailOptions);

  const messageId = await sendMail(mailOptions);
  return res.status(200).send(messageId);
}

module.exports = sendMailFunc;
