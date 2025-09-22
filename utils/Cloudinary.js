import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * ✅ رفع صورة أو ملف (PDF, Word, ...) إلى Cloudinary
 * @param {Buffer} buffer - محتوى الملف (من multer memoryStorage)
 * @returns {Promise<object>} - رابط الملف + publicId
 */
export const cloudinaryUploadFile = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" }, // auto = يقبل صور + ملفات
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};


export const cloudinaryUploadMultiple = async (files, folder = "hotels") => {
  try {
    const uploadPromises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: "auto",
            },
            (error, result) => {
              if (result)
                resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                }); // ✅ object مش string
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload images to Cloudinary");
  }
};

//  * ✅ مسح ملف واحد من Cloudinary
//  * @param {string} publicId - الـ publicId الخاص بالملف
//  * @returns {Promise<object>}
//  */
export const cloudinaryRemoveFile = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });
  } catch (error) {
    return error;
  }
};

/**
 * ✅ مسح مجموعة ملفات من Cloudinary
 * @param {string[]} publicIds - مصفوفة publicId
 * @returns {Promise<object>}
 */
export const cloudinaryRemoveMultipleFiles = async (publicIds) => {
  try {
    return await cloudinary.api.delete_resources(publicIds, {
      resource_type: "auto",
    });
  } catch (error) {
    return error;
  }
};
