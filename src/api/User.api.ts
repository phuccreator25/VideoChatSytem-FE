import axiosInterceptor from "../config/axiosInterceptor";

const userApi = {
  onGetDataUser: () => axiosInterceptor.get("/users"),
};

export default userApi;