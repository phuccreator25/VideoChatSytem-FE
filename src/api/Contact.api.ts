import axiosInterceptor from "../config/axiosInterceptor";
import type { contacts } from "../types/contact/contact.model.type";

const ContactApi = {
  onGetContact: () => axiosInterceptor.get("/contacts"),
  onUpdateContact: (payload: contacts | { nickname: string; userId: string }) =>
    axiosInterceptor.put(`/contacts`, payload),
  onRemoveContact: (idFriend: string) =>
    axiosInterceptor.delete(`/contacts/${idFriend}`),
  onGetContactsOnlines: () => axiosInterceptor.get(`/contacts/user-online`),

  onSearchContacts: (keyword: string, excludeUserIds: string[] = []) =>
    axiosInterceptor.get(`/contacts/search-users`, {
      params: { keyword, excludeUserIds: excludeUserIds.join(",") }
    }),
};
export default ContactApi;
