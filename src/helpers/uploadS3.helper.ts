import axios from "axios";
import uploadAPI from "../api/upload.api";
import { compressImageHelper } from "./compressImage.helper";
import { enqueueSnackbar } from "notistack";
import { CHUNK_SIZE } from "../data/upload.data";
import { CONFIG } from "../config/appConfig";

type PartItem = {
    partNumber: number;
    presignedUrl: string;
};

type PresignedItem = {
    tempAttachmentId: string;
    presignedUrl?: string;
    fileName?: string;
    mimeType?: string;
    s3Key: string;
    uploadId?: string;
    uploadType: string;
    parts?: PartItem[];
    totalParts?: number;
};

type PreviewFiles = {
    tempAttachmentId: string;
    file: File;
    fileName: string;
    fileSize: number;
    mimeType: string;
    resourceType: string;
    previewUrl: string | null;
    recordDuration: number | null;
}
export const uploadControllers = new Map<string, AbortController>();

export const handleCancelSingleFile = async (item: {
    tempAttachmentId: string;
}) => {
    const { tempAttachmentId } = item;

    const controller = uploadControllers.get(tempAttachmentId);

    if (controller) {
        controller.abort();
        uploadControllers.delete(tempAttachmentId);
    }
};

export const putBinaryToS3 = async (
    presignedUrl: string,
    file: File | Blob,
    mimeType: string,
    signal?: AbortSignal | undefined
) => {
    return await axios.put(presignedUrl, file, {
        headers: {
            "Content-Type": mimeType,
        },
        transformRequest: [(data, headers) => {
            delete headers.common?.["Authorization"];
            delete headers["Authorization"];
            return data;
        }],
        signal,
    });
};

const uploadMultipartFile = async (
    item: PresignedItem,
    file: File,
    signal: AbortSignal
) => {
    const { s3Key, uploadId, parts } = item;
    if (!uploadId) throw new Error("Thiếu uploadId cho multipart upload");

    try {
        const uploadedParts: { PartNumber: number; ETag: string }[] = [];

        if (parts && parts.length > 0) {
            const CONCURRENCY = 3;
            for (let i = 0; i < parts.length; i += CONCURRENCY) {
                const batch = parts.slice(i, i + CONCURRENCY);

                const batchResults = await Promise.all(
                    batch.map(async (part) => {
                        const start = (part.partNumber - 1) * CHUNK_SIZE;
                        const end = Math.min(start + CHUNK_SIZE, file.size);
                        const chunkBlob = file.slice(start, end);

                        const res = await putBinaryToS3(
                            part.presignedUrl,
                            chunkBlob,
                            "application/octet-stream",
                            signal
                        );
                        const rawEtag = res.headers["etag"] || res.headers["ETag"] || "";
                        const etag = rawEtag.replace(/^"|"$/g, "");

                        return {
                            PartNumber: part.partNumber,
                            ETag: etag,
                        };
                    })
                );
                uploadedParts.push(...batchResults);
            }
        }

        uploadedParts.sort((a, b) => a.PartNumber - b.PartNumber);

        return await uploadAPI.onCompleteMultipart({
            s3Key,
            uploadId,
            parts: uploadedParts,
        });
    } catch (error) {
        console.log('FAILED UPLOAD: ', error);
        throw error;
    }
};

export const uploadMessageAttachments = async (
    presignedUrls: PresignedItem[],
    messageId: string,
    previewFiles: PreviewFiles[],
    tempMessageId: string
) => {
    const results = await Promise.allSettled(
        presignedUrls.map(async (item) => {
            const file = previewFiles.find((f) => f.tempAttachmentId === item.tempAttachmentId)?.file;
            if (!file) throw new Error("File not found");

            const controller = new AbortController();
            uploadControllers.set(item.tempAttachmentId, controller);

            if (item.uploadType === "single") {
                if (!item.presignedUrl) throw new Error("Thiếu presignedUrl cho single upload");
                try {
                    return await putBinaryToS3(item.presignedUrl, file, item.mimeType || file.type, controller.signal);
                } finally {
                    uploadControllers.delete(item.tempAttachmentId);
                }
            } else {
                try {
                    return await uploadMultipartFile(item, file, controller.signal);
                } finally {
                    uploadControllers.delete(item.tempAttachmentId);
                }
            }
        })
    );

    const successAttachmentIds: string[] = [];
    const failedAttachmentIds: string[] = [];

    results.forEach((res, index) => {
        const tempId = presignedUrls[index].tempAttachmentId;
        if (res.status === "fulfilled") successAttachmentIds.push(tempId);
        else failedAttachmentIds.push(tempId);
    });

    await uploadAPI.onUpdateStatus({ messageId, tempMessageId, successAttachmentIds, failedAttachmentIds });
};

export const updateAvatarS3 = async (avatarFile: File) => {
    const compressed = await compressImageHelper(avatarFile);
    console.log({ compressed });


    const presignURL = await uploadAPI.onPresignURL({
        files: { fileName: compressed.name, mimeType: compressed.type, fileSize: compressed.size },
        type: "avatar",
    });

    if (!presignURL.data.data?.[0]?.presignedUrl) {
        enqueueSnackbar("Đã xảy ra lỗi trong quá trình tải file. Vui lòng thử lại", { variant: "error" });
        return { success: false };
    }

    const uploadRes = await putBinaryToS3(presignURL.data.data[0].presignedUrl, compressed, compressed.type);

    if (uploadRes.status !== 200) {
        enqueueSnackbar("Đã xảy ra lỗi trong quá trình tải file. Vui lòng thử lại", { variant: "error" });
        return { success: false };
    }

    return { success: true, fileName: compressed.name };
};


window.addEventListener("pagehide", () => {
    const tempIdUploads = Array.from(uploadControllers.keys());

    if (tempIdUploads.length > 0) {
        fetch(`${CONFIG.API_HOST}/upload/cancel-upload`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ failedAttachmentIds: tempIdUploads }),
            keepalive: true,        // request tiếp tục chạy ngầm khi tab đóng
            credentials: "include",
        }).catch(() => { });
    }
});

