// @ts-nocheck

import { db } from '../utils/firebase';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { User } from '../interfaces/index';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import axios, { AxiosInstance } from 'axios';
const isDev = process.env.NODE_ENV === 'development';
const baseURL = isDev ? 'dev url' : 'produrl';

class FirebaseApi {
  firebaseIdToken?: string;
  apiClient: AxiosInstance = axios.create({});

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      const token = await user?.getIdToken();
      this.firebaseIdToken = token;

      this.apiClient = axios.create({
        baseURL: baseURL,
        headers: {
          Authorization: 'Bearer ' + this.firebaseIdToken,
        },
      });
    });
  }

  getUser = async (uid: string): Promise<User | null> => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return { uid, ...snap.data() } as User;
    }
    return null;
  };

  createUser = async (userId: string, data: any) => {
    const batch = writeBatch(db);

    const userRef = doc(db, 'users', userId);
    batch.set(userRef, data);

    await batch.commit();
  };

  createAccount = async (email: string, password: string, data: any) => {
    // Firebase User entity creation for authorization
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const userId = userCredentials.user.uid;
    // Firebase Database user entity creation for metadata
    await this.createUser(userId, data);
    return { userId };
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
}

export default new FirebaseApi();
