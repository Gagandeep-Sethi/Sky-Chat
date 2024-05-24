const cloudinary = require("cloudinary").v2;

const uploadImagesToCloudinary = async (file, folder) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    //secure: process.env.NODE_ENV !== "development",
  });

  const uploadPromise = new Promise((resolve, reject) => {
    //const fileName = `image_${index + 1}`; // Generate a unique filename
    cloudinary.uploader
      .upload_stream(
        { folder: folder, resource_type: "image" },
        (error, result) => {
          if (error) {
            return reject(error);
          } else {
            return resolve(result);
          }
        }
      )
      .end(file.data);
  });

  const result = await uploadPromise;

  return result.public_id;
};
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result; // Return the result for further handling if needed
  } catch (error) {
    throw error; // Re-throw the error to be handled by the calling function
  }
};

module.exports = {
  uploadImagesToCloudinary,
  deleteImage,
};
