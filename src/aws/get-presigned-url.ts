import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import { randomUUID } from "crypto";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3 = new S3Client({
  credentials: {
    accessKeyId: env.S3_BUCKET_ACCESS_KEY,
    secretAccessKey: env.S3_BUCKET_SECRET_KEY,
  },
  region: env.S3_BUCKET_REGION,
});

type PresignedURLParams = {
  fileType: string;
  maxFileSize?: number;
};

const MAX_SIZE_DEFAULT = 5 * 1024 * 1024; // 5MB

const createPresignedURL = async (params: PresignedURLParams) => {
  const fileKey = randomUUID();

  const presigned = await createPresignedPost(s3, {
    Bucket: env.S3_BUCKET_NAME,
    Key: fileKey,
    Conditions: [
      // content length up to 5mb
      ["content-length-range", 0, params.maxFileSize || MAX_SIZE_DEFAULT],
    ],
    Fields: {
      "Content-Type": params.fileType,
    },
  });

  return { presigned, fileKey };
};

export { createPresignedURL };
