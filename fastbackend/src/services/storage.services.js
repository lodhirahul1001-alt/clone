const Imagekit = require("imagekit");

const storageIntance = new Imagekit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

const uploadImage = async (fileBuffer, originalname) => {
  try {
    const res = await storageIntance.upload({
      file: fileBuffer,
      fileName: originalname,
      folder: "pr-digital",
    });
    return res;
  } catch (error) {
    console.log("Error in uploading image", error);
  }
};

module.exports = uploadImage;
