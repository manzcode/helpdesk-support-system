import multer from "multer";
import path from "path";

export function middlewareMulter(arr: string[]) {
  return multer({
    storage: multer.diskStorage({}),
    limits: {
      fileSize: 1024 * 1024 * 5, // limite de taille du fichier à 5 Mo
      files: 10, // limite le nombre de fichiers à 10
    },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (arr.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error("Le type de fichier n'est pas pris en charge"));
      }
    },
  });
}
