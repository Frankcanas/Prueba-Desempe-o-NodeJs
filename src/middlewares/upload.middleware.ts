import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

// Almacenamiento en memoria para procesamiento directo de JSON
const storage = multer.memoryStorage();

// Filtro de archivo: solo permitir archivos JSON
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isJson = ext === '.json' || file.mimetype === 'application/json';

  if (isJson) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos en formato JSON (.json)'));
  }
};

export const uploadJson = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10 MB
  },
});
