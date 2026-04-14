export type contacts = {
    userId: string,
    fullname: string,
    nickname: string,
    avatar: string,
    onClick?: () => void;
} 

export type ContactSection = {
  key: string;
  letter: string;
  items: contacts[];
};