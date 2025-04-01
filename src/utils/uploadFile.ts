import cloudinary from "@config/cloudinary.config";
import { UploadedFile } from "express-fileupload";

export const uploadFileToCloudinary = async (
  file: UploadedFile,
  folder: string = "avatar"
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: "image",
      timeout: 60000,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Lỗi khi tải ảnh lên Cloudinary");
  }
};
