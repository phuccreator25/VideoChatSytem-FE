import axiosInterceptor from "../config/axiosInterceptor";

const BlockApi = {
    onBlock : (userId: string) => axiosInterceptor.post('/blocks', {userId}),
    onUnblock : (userId: string) => axiosInterceptor.put('/blocks/unBlock', {userId}),
}
export default BlockApi
