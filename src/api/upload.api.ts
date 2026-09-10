import axiosInterceptor from "../config/axiosInterceptor";
import { CONFIG } from "../config/appConfig";
import type { avatarFile, GetPartPresignedUrlParams, CompleteMultipartParams } from "../types/upload.type";

const uploadAPI = {
    onPresignURL: (payload: { files: avatarFile | GetPartPresignedUrlParams; type: string }) => axiosInterceptor.post(`${CONFIG.API_HOST}/upload/presigned-url`, payload),
    onUpdateStatus: (payload: { messageId: string; tempMessageId?: string; successAttachmentIds?: string[]; failedAttachmentIds?: string[]; }) => axiosInterceptor.post(`${CONFIG.API_HOST}/upload/update-status`, payload),
    onCompleteMultipart: (payload: CompleteMultipartParams) => axiosInterceptor.post(`${CONFIG.API_HOST}/upload/complete-multipart`, payload),
}

export default uploadAPI