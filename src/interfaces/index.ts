export type User = {
  uid: string;
  email: string;
  industries: string[];
  locations: string[];
  firstName: string;
  profileImage: string;
  lastName: string;
  role: UserRoles;
  companyId: string;
};

export type NotificationButton = {
  href: string;
  name: string;
  type: 'accept' | 'decline';
};

export type Notification = {
  id: string;
  email: string;
  title: string;
  description: string;
  notificationType: string;
  buttons: NotificationButton[];
  lastName: string;
  role: UserRoles;
  companyId: string;
};

export enum UserRoles {
  COMPANY_ADMIN = 'company_admin',
  RECRUITER = 'company_recruiter',
  CANDIDATE = 'candidate',
}

export type Company = {
  id: string;
  email: string;
  name: string;
  industries: string[];
  locations: string[];
  ownerId: string;
  profileImage: string;
};

export type InviteInfo = {
  urlToken: string;
  company: Company;
  invitedEmail: string;
};
