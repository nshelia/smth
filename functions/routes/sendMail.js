async function sendMail(req, res) {
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
    const messageId = await sendMail(mailOptions);
    return res.status(200).send(messageId);
}

module.exports = sendMail;
