import axiosInterceptor from "../config/axiosInterceptor";
import type { contacts } from "../types/contact/contact.model.type";

const ContactApi = {
    onGetContact : () => axiosInterceptor.get('/contacts'),
    onUpdateContact : (payload : contacts) => axiosInterceptor.put(`/contacts`, payload),
    onRemoveContact : (idFriend : string) => axiosInterceptor.delete(`/contacts/${idFriend}`)
}
export default ContactApi
