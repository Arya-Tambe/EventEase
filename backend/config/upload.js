const multer = require('multer');
const path = require('path');

const useS3 = process.env.AWS_ACCESS_KEY_ID &&
              process.env.AWS_SECRET_ACCESS_KEY &&
              process.env.AWS_S3_BUCKET;

let upload;

if (useS3) {
  const multerS3 = require('multer-s3');
  const s3Client = require('./s3');

  upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_S3_BUCKET,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const filename = `portfolio/${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
        cb(null, filename);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (extname && mimetype) cb(null, true);
      else cb(new Error('Only image files are allowed'));
    }
  });

  console.log('📦 Using AWS S3 for file storage');

} else {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`);
    }
  });

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      if (extname) cb(null, true);
      else cb(new Error('Only image files are allowed'));
    }
  });

  console.log('📁 Using local storage for file uploads');
}

module.exports = upload;