const admin = require('firebase-admin');

async function getCompanyById(id) {
  const firestore = admin.firestore();
  const company = await firestore.collection('companies').doc(id).get();
  if (!company.exists) {
    throw new Error("Company can't be found");
  }
  return company;
}

module.exports = { getCompanyById };
