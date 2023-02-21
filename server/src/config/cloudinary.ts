import { Cloudinary } from "@cloudinary/url-gen";

export const cldInstance: Cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
