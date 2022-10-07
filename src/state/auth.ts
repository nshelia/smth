import { atom } from 'recoil';
import { User } from '../interfaces';

export const authUser = atom<User | null>({
  dangerouslyAllowMutability: true,
  key: 'authUser',
  default: null,
});

export const authInitializeTracker = atom<boolean>({
  key: 'authInitializeTracker',
  default: false,
});
