// @ts-nocheck

import { db } from '../utils/firebase';
import {  setDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const isDev = process.env.NODE_ENV === 'development';


const baseURL = isDev
  ? 'http://localhost:5001/hackproject-27248/us-central1/app'
  : 'https://us-central1-hackproject-27248.cloudfunctions.net/app';


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

  calculatePrice = async (values) => {
    const { data } = await this.apiClient.post('/calculate-price', {
      make: values.selectedMan,
      model: values.selectedModel,
      year: values.year,
      kilometers: values.milage,
      fuelType: values.fuelType
    });
    return data
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

  updateRequest = async (id, state) => {
    const requestDocRef = doc(db, "requests", id);

    await updateDoc(requestDocRef, {
      state
    });
  }

  getRequestList = async (ids = []) => {
    const data = await Promise.all(ids.map(item => {
      return this.getRequest(item)
    }))

    return data.filter(Boolean).reverse()
  }
}

export default new FirebaseApi();
