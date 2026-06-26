export type Contact = {
  _id: string;
  userId: string;
  fullname: string;
  nickname: string;
  avatar: string;
  email: string;
  isBlocked: boolean;
  onClick?: () => void;
};

export type contacts = Contact;

export type ContactSection = {
  key: string;
  letter: string;
  items: Contact[];
};
