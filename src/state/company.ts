import { atom } from 'recoil';
import { Company } from '../interfaces';

export const authCompany = atom<Company | null>({
  key: 'authCompany',
  default: null,
});
