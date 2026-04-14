import axiosInterceptor from "../config/axiosInterceptor";

const ContactApi = {
    onGetContact : () => axiosInterceptor.get('/contacts')
}
export default ContactApi