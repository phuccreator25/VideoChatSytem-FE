export type Contact = {
  _id?: string;
  userId: string;
  fullname: string;
  nickname?: string | null;
  avatar?: string;
  email?: string;
  isBlocked?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
};

export type contacts = Contact;

export type ContactSection = {
  key: string;
  letter: string;
  items: Contact[];
};
