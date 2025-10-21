import multer from "multer";
import path from "path";
import fs from "fs";

// créer le dossier uploads s'il n'existe pas
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads";
    switch (file.fieldname) {
      case "avatar":
        folder = "uploads/avatars";
        break;
      case "logo":
        folder = "uploads/logos";
        break;
      case "identityCard":
        folder = "uploads/identityCards";
        break;
      case "imageShop":
        folder = "uploads/imageBoutiques";
        break;
      case "productImage":
        folder = "uploads/products";
        break;
    }

    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only .jpg, .jpeg and .png files are allowed"), false);
};

const upload = multer({ storage, fileFilter });
export default upload;
