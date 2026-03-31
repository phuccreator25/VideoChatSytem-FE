export type typeRegister = {
    fullname: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type typeLogin = {
    email: string,
    password: string,
    deviceId: string
}