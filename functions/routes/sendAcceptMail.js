const { generateTemplateForAccept, sendMail } = require('../utils/email');

async function sendAcceptMail(req, res) {
  const dest = req.body.email;
  const make = req.body.make;
  const finalPrice = req.body.finalPrice;
  const mailOptions = await generateTemplateForAccept(dest, make, finalPrice);

  const messageId = await sendMail(mailOptions);
  return res.status(200).send(messageId);
}

module.exports = sendAcceptMail;
