const multer = require('multer');
const path = require('path');
const fs = require('fs');

const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let cloudinary = null;
let upload;

if (hasCloudinary) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const cloudinaryStorage = {
    _handleFile(req, file, cb) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'aurem',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
        },
        (error, result) => {
          if (error) return cb(error);
          cb(null, { fieldname: file.fieldname, filename: result.public_id, path: result.secure_url, size: result.bytes });
        }
      );
      file.stream.pipe(uploadStream);
    },
    _removeFile(req, file, cb) {
      if (file.filename) cloudinary.uploader.destroy(file.filename, cb);
      else cb(null);
    },
  };

  upload = multer({
    storage: cloudinaryStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Only image files are allowed'), false);
    },
  });
} else {
  // Local disk storage fallback
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

  upload = multer({
    storage: diskStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Only image files are allowed'), false);
    },
  });

  // Patch multer result to match the {filename, path} shape controllers expect
  const originalSingle = upload.single.bind(upload);
  const originalArray = upload.array.bind(upload);

  const patchFile = (file, req) => {
    if (!file) return;
    file.filename = file.filename || file.path;
    file.path = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  };

  upload = {
    single: (field) => (req, res, next) => {
      originalSingle(field)(req, res, (err) => {
        if (err) return next(err);
        if (req.file) patchFile(req.file, req);
        next();
      });
    },
    array: (field, max) => (req, res, next) => {
      originalArray(field, max)(req, res, (err) => {
        if (err) return next(err);
        if (req.files) req.files.forEach((f) => patchFile(f, req));
        next();
      });
    },
    none: () => multer().none(),
  };

  console.log('📁 Cloudinary not configured — using local disk storage (backend/uploads/)');
}

module.exports = { cloudinary, upload };
