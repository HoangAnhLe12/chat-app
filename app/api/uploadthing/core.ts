import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server" 
const f = createUploadthing();
 
const handleAuth = () => {
    const userId = auth();
    if (!userId) throw new Error("uanuthorized");
    return {userId: userId}
}
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({
    image: { maxFileSize: "2MB", maxFileCount: 2 },
    video: { maxFileSize: "256MB", maxFileCount: 1 },
  })
  .middleware(() => handleAuth())
  .onUploadComplete(() => {}),
messageFile: f(["image", "pdf", "video/mp4"])
  .middleware(() => handleAuth())
  .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;