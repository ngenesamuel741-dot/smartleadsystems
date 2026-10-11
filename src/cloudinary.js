import { cloudinaryConfig } from "./config";

export async function uploadToCloudinary(file) {
  if (cloudinaryConfig.cloudName.startsWith("PASTE_")) throw new Error("Add your Cloudinary cloud name and unsigned upload preset in src/config.js");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image is too large (max 10 MB).");
  const b = new FormData();
  b.append("file", file); b.append("upload_preset", cloudinaryConfig.uploadPreset); b.append("folder", cloudinaryConfig.folder);
  const r = await fetch("https://api.cloudinary.com/v1_1/" + cloudinaryConfig.cloudName + "/image/upload", { method: "POST", body: b });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error("Upload failed: " + ((j.error && j.error.message) || r.status) + ". Check the preset 'Smartleadsystems' exists and is set to Unsigned.");
  return j.secure_url;
}
