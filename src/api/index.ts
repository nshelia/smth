// @ts-nocheck

import { db } from '../utils/firebase';
import {  setDoc, doc, getDoc } from 'firebase/firestore';
import axios from 'axios';

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const isDev = process.env.NODE_ENV === 'development';


const baseURL = isDev
  ? 'http://localhost:5001/hackproject-27248/us-central1/app'
  : 'https://greetle.app/api';


class FirebaseApi {

  apiClient: AxiosInstance = axios.create({
    baseURL: baseURL
  });

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

  sendDocument = async (id, make) => {
    return this.apiClient.post('/send-email', {
      documentId: id,
      make,
    });
  }

  sendDeclineEmail = async (data) => {
    return this.apiClient.post('/send-decline-email', data);
  }


  sendAcceptEmail = async (data) => {
    return this.apiClient.post('/send-accept-email', data);
  }
}

export default new FirebaseApi();
