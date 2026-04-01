import multer from "multer";
import path from "path";
import fs from "fs";

export const createUploader = (folderName) => {
  // ensure folder exists
  const uploadPath = `uploads/${folderName}`;
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
};