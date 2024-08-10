import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTFiles } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/db/services/user";
import { utapi } from "@/lib/uploadthing";
import { randomUUID } from "crypto";

const f = createUploadthing({
  /**
   * Log out more information about the error, but don't return it to the client
   * @see https://docs.uploadthing.com/errors#error-formatting
   */
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);

    return { message: err.message };
  },
});

const authMiddleware = (req: Request) => {
  const { userId } = auth();

  if (!userId) {
    throw new UploadThingError("Unauthorized");
  }
  const user = getUserByClerkId(userId);

  return user;
}; // Fake authMiddleware function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  pdfUploader: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1, minFileCount: 1 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files }) => {
      // This code runs on your server before upload
      const user = await authMiddleware(req);

      // If you throw, the user will not be able to upload
      if (!user || !user.id) throw new UploadThingError("Unauthorized");

      const userId = user.id.toString();

      const fileOverrides = files.map((file) => {
        return { ...file, customId: user.id + "-" + randomUUID() };
      });

      console.log(fileOverrides);
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, [UTFiles]: fileOverrides };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      const tempUrl = await utapi.getSignedURL(file.key);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { fileKey: file.key, uploadedBy: metadata.userId, tempUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
