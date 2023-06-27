// inspired by UploadThing https://github.com/pingdotgg/uploadthing

import { api } from "~/server/utils/api";
import { toast } from "react-hot-toast";
import { fileValidator } from "~/shared/validators/upload-files-validators";

type UploadArgs = {
  allowedFileTypes: string[];
  maxFileSize: number;
  onUploadCompleted?: (result: { fileKey: string; fileUrl: string }[]) => void;
  onError?: (error?: unknown) => void;
  onSettled?: () => void;
};

const useUpload = (opts: UploadArgs) => {
  const { allowedFileTypes, maxFileSize, onError, onUploadCompleted, onSettled } = opts;
  const { mutateAsync } = api.upload.createPresignedURLs.useMutation();

  const uploadFiles = async (files: File[]) => {
    try {
      const validationResult = fileValidator({ files, allowedFileTypes, maxFileSize });

      if (!validationResult.success) {
        throw new Error(validationResult.error.message);
      }

      const uploadFiles = files.map(file => ({ fileName: file.name, fileType: file.type }));
      const presignedURLs = await mutateAsync({ files: uploadFiles });

      if (!presignedURLs || !Array.isArray(presignedURLs)) {
        throw new Error("Wtf?");
      }

      const fileUploadPromises = presignedURLs.map(async upload => {
        const file = files.find(file => file.name === upload.fileName);

        if (!file) {
          throw new Error("No presigned URL for the file");
        }

        const { url, fields } = upload.presigned;

        const formData = new FormData();

        Object.entries({ ...fields, file }).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const fileKey = fields["key"];

        const fileUrl = `https://d2w76mn1em43bl.cloudfront.net/${fileKey}`;

        return { fileKey, fileUrl };
      });

      const result = await Promise.all(fileUploadPromises);

      if (onUploadCompleted) {
        onUploadCompleted(result);
      }

      return result;
    } catch (error) {
      process.env.NODE_ENV === "development" && console.error(error);

      if (onError) {
        onError(error);
      }
    } finally {
      if (onSettled) {
        onSettled();
      }
    }
  };

  return { uploadFiles };
};

export { useUpload };
