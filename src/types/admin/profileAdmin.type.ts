export type typeProfileAdmin = {
    _id: string
    username: string
    email: string
    fullname: string
    avatar: string
    role: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    createdByUser?: {
        _id: string,
        fullname: string
    }
}

export type typeUpdateAdmin = {
    fullname?: string
    username?: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
    filename?: string
}