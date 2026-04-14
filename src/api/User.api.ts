import axiosInterceptor from "../config/axiosInterceptor";

const userApi = {
  onGetDataUser: () => axiosInterceptor.get("/users"),
  onUpdateUser: (payload : object) => axiosInterceptor.put(`/users`, payload),
  onUpdateAvatar: (payload : FormData) => axiosInterceptor.put(`/users/avatar`, payload),

  onSearchUser: (searchValue : string) => axiosInterceptor.get(`users/search/${searchValue}`)
};

export default userApi;