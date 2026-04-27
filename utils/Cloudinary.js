import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const cloudinaryUploadFile = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
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
                });
              else reject(error);
            },
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        }),
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload images to Cloudinary");
  }
};

export const cloudinaryRemoveFile = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });
  } catch (error) {
    return error;
  }
};

export const cloudinaryRemoveMultipleFiles = async (publicIds) => {
  try {
    return await cloudinary.api.delete_resources(publicIds, {
      resource_type: "auto",
    });
  } catch (error) {
    return error;
  }
};
