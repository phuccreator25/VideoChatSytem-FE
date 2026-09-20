export type avatarFile = {
  fileName: string;
  mimeType: string;
  fileSize?: number;
}

export type GetPartPresignedUrlParams = {
  uploadId: string;
  partNumber: number;
  s3Key: string;
}   

export type CompleteMultipartParams = {
  uploadId: string;
  s3Key: string;
  parts: { PartNumber: number; ETag: string }[];
}

export type AbortMultipartParams = {
  tempAttachmentId: string;
}