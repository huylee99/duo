import { authedProcedure, createTRPCRouter } from "../trpc";
import { presignedURLsSchema } from "~/shared/validators/upload-files-validators";
import { createPresignedURL } from "~/aws/get-presigned-url";
import { TRPCError } from "@trpc/server";

const createPresignedURLs = authedProcedure.input(presignedURLsSchema).mutation(async ({ ctx, input }) => {
  const presignedURLSPromises = input.files.map(async file => {
    const { presigned, fileKey } = await createPresignedURL({ fileType: file.fileType });

    return { presigned, fileKey, fileName: file.fileName };
  });

  try {
    const presignURLs = await Promise.all(presignedURLSPromises);

    return presignURLs;
  } catch (error) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to create presigned URLs" });
  }
});

const uploadRouter = createTRPCRouter({
  createPresignedURLs,
});

export default uploadRouter;
