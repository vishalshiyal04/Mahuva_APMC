import multer from 'multer';
import fs from 'fs';
import path from 'path';

fs.mkdirSync('uploads', { recursive: true });
const upload = multer({ storage: multer.diskStorage({ destination: 'uploads',
  filename: (r, f, cb) => cb(null, Date.now() + '-' + Math.floor(Math.random() * 1e6) + path.extname(f.originalname).toLowerCase()) }),
  limits: { fileSize: 5e6 }, fileFilter: (r, f, cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(f.mimetype)) });

export default upload;
