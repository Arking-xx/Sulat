const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const blogPostStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Sulat/posts',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Sulat/profile',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

module.exports = {
  cloudinary,
  blogPostStorage,
  profilePicStorage,
};
