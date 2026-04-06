import axiosInterceptor from "../config/axiosInterceptor";

const userApi = {
  onGetDataUser: () => axiosInterceptor.get("/users"),
  onUpdateUser: (payload : object) => axiosInterceptor.put(`/users`, payload)
};

export default userApi;