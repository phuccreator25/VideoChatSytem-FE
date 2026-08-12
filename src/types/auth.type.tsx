export type typeRegister = {
    fullname: string,
    email: string,
    password: string,
    confirmPassword: string
    agree?: boolean;
}

export type typeLogin = {
    email: string,
    password: string,
    deviceId?: string
}

export type DeviceSessionItem = {
    _id?: string;
    sessionId: string;
    userId: string;
    deviceId: string;
    name: string;
    userAgent: string;
    ipAddress: string;
    refreshToken?: string;
    expiredAt: string;
    revokedAt?: string | null;
    lastSeenAt: string;
    createdAt: string;
    updatedAt?: string | null;
    isCurrentSession: boolean;
};