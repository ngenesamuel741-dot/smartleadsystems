import { cloudinaryConfig } from "./config";

const MAX_IMAGE = 10 * 1024 * 1024, MAX_VIDEO = 100 * 1024 * 1024; // Cloudinary free-plan limits

// Phone photos are often 5-12 MB. Shrink them first so uploads are fast and always accepted. Cloudinary then optimises delivery.
async function shrink(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 1.2 * 1024 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file), scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 5 * 1024 * 1024) return file;
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const type = file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise(r => c.toBlob(r, type, 0.86));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, "") + (type === "image/png" ? ".png" : ".jpg"), { type }) : file;
  } catch (e) { return file; } // e.g. HEIC: upload the original
}

// kind: "image" (photos only) or "media" (photos or videos). Resolves to the final https link.
export async function uploadToCloudinary(file, { kind = "image", onProgress } = {}) {
  if (!cloudinaryConfig.cloudName || cloudinaryConfig.cloudName.startsWith("PASTE_")) throw new Error("Cloudinary is not set up in src/config.js");
  const isVid = file.type.startsWith("video/"), isImg = file.type.startsWith("image/");
  if (!isImg && !isVid) throw new Error("Please choose a photo" + (kind === "media" ? " or a video." : "."));
  if (isVid && kind !== "media") throw new Error("This spot takes a photo, not a video.");
  const f = isImg ? await shrink(file) : file;
  if (isImg && f.size > MAX_IMAGE) throw new Error("That photo is too large (max 10 MB).");
  if (isVid && f.size > MAX_VIDEO) throw new Error("That video is too large (max 100 MB). Trim or compress it first.");
  const body = new FormData();
  body.append("file", f); body.append("upload_preset", cloudinaryConfig.uploadPreset); body.append("folder", cloudinaryConfig.folder);
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("POST", `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`);
    x.upload.onprogress = e => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
    x.onerror = () => reject(new Error("Upload failed. Check your internet connection and try again."));
    x.onload = () => {
      let j = {}; try { j = JSON.parse(x.responseText); } catch (e) { /* ignore */ }
      if (x.status >= 200 && x.status < 300 && j.secure_url) resolve(j.secure_url);
      else reject(new Error("Upload failed: " + ((j.error && j.error.message) || x.status) + ". In Cloudinary, make sure the preset '" + cloudinaryConfig.uploadPreset + "' is Unsigned and allows images and videos."));
    };
    x.send(body);
  });
}
