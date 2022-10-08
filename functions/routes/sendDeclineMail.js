async function sendDeclineMail() {
    const dest = req.body.email;
    const make = req.body.make;
    const comments = req.body.comments;
    const declinedImages = req.body.declinedImages;
    const mailOptions = await generateTemplateForDeclined(dest, make, comments);

    const messageId = await sendMail(mailOptions);
    return res.status(200).send(messageId);
}

module.exports = sendDeclineMail;