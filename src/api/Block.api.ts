import axiosInterceptor from "../config/axiosInterceptor";
import type { contacts } from "../types/contact/contact.model.type";

const BlockApi = {
    onBlock : (payload : contacts) => axiosInterceptor.post('/blocks', payload),
    onUnblock : (payload : contacts) => axiosInterceptor.put('/blocks/unBlock', payload),
}
export default BlockApi
