
export type AdminUserItem = {
  _id: string,
  email: string,
  fullname: string,
  username: string,
  avatar: string,
  role: string,
  isActive: boolean,
  isBanned: boolean,
  bannedBy: null | string,
  banReason: null | string,
  bannedAt: null | string,
  lastSeenAt: string,
  createdAt: string,
  updatedAt: string,
  isOnline: boolean,
  createdByUser?: {
    avatar: string,
    email: string,
    fullname: string,
    username: string,
    _id: string,
  },
  bannedByInfo?: {
    avatar: string,
    email: string,
    fullname: string,
    username: string,
    _id: string,
  }
};

export type typeQueryUser = {
  search?: string | null,
  role?: string,
  isActive?: string,
  isBanned?: string,
  isOnline?: string
}

export type typeDataCreateUser = {
  username: string,
  fullname: string,
  email: string,
  password: string,
  confirmPassword?: string
}

export type typeDataUpdateUser = {
  _id: string,
  email?: string,
  fullname?: string,
  username?: string,
  password?: string,
  confirmPassword?: string,
  role?: string
}
