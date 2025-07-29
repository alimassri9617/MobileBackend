import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

console.log("Cloudinary Config - CLOUD_CLOUD_NAME:", process.env.CLOUD_CLOUD_NAME);
console.log("Cloudinary Config - CLOUD_API_KEY:", process.env.CLOUD_API_KEY ? "Loaded" : "Not Loaded");
console.log("Cloudinary Config - CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET ? "Loaded" : "Not Loaded");

cloudinary.config({
  cloud_name: process.env.CLOUD_CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;
