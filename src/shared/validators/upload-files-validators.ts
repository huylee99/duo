import * as z from "zod";

const presignedURLsSchema = z.object({
  files: z.array(
    z.object({
      fileName: z.string(),
      fileType: z.string(),
    })
  ),
});

type FilesValidator = {
  allowedFileTypes: string[];
  maxFileSize: number;
  files: File[];
};

const fileValidator = (args: FilesValidator) => {
  const { maxFileSize, files, allowedFileTypes } = args;

  return z
    .object({
      file:
        typeof window === "undefined"
          ? z.undefined()
          : z
              .instanceof(Array<File>)
              .refine(files => {
                let isValidated = true;
                if (files.length > 0) {
                  for (let i = 0; i < files.length; i++) {
                    if (files[i] && !allowedFileTypes.includes(files[i].type)) {
                      isValidated = false;
                      break;
                    }
                  }
                }
                return isValidated;
              }, "Định dạng không được hỗ trợ")
              .refine(files => {
                let isValidated = true;
                if (files.length > 0) {
                  for (let i = 0; i < files.length; i++) {
                    if (files[i] && files[i].size > maxFileSize) {
                      isValidated = false;
                      break;
                    }
                  }
                }
                return isValidated;
              }, "Kích thước file phải nhỏ hơn 5MB"),
    })
    .safeParse({ file: files }, { errorMap: err => ({ message: err.message || "" }) });
};

export { presignedURLsSchema, fileValidator };
