// @ts-nocheck

import { db } from '../utils/firebase';
import {  setDoc, doc, getDoc } from 'firebase/firestore';
import axios from 'axios';

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}


class FirebaseApi {

  createRequest = async (id, data: any) => {
    await setDoc(doc(db, "requests", id), data);
  };

  fetchMain = async () => {
    const { data } = await axios.get(
      'https://api2.myauto.ge/ka/services/quick-main-data/all/get',
    );
    return JSON.parse(data.data.manufactors).map((item) => ({
      value: item.man_id,
      label: item.man_name,
    }));
  };

  calculatePrice = async () => {
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        return resolve({
          from: randomIntFromInterval(20000,25000),
          to: randomIntFromInterval(27000,28000)
        })
      },1500)
    })
  }

  getRequest = async (id) => {
    const snap = await getDoc(doc(db, 'requests', id));
    if (snap.exists()) {
      return snap.data() as InviteInfo;
    }
    return null;
  }

  revisionForPhotos = async (id, declinedData) => {

  }
}

export default new FirebaseApi();
