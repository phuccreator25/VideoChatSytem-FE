import axiosInterceptor from "../config/axiosInterceptor";

const BlockApi = {
    onBlock: (userId: string) => axiosInterceptor.post('/blocks', { userId }),
    onUnblock: (userId: string) => axiosInterceptor.put('/blocks/unBlock', { userId }),
    onGetListBlockUser: () => axiosInterceptor.get('/blocks/list-block-user'),
}
export default BlockApi
