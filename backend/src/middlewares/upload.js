// ============================================
// File Upload Configuration (Multer)
// ============================================
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'images';
    if (file.mimetype.startsWith('audio/')) {
      folder = 'audio';
    }
    cb(null, path.join(UPLOAD_DIR, folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/webm'];
  const allowed = [...allowedImageTypes, ...allowedAudioTypes];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed.`), false);
  }
};

// Upload middleware instances
const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024 }
}).single('image');

const uploadAudio = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_AUDIO_SIZE) || 10 * 1024 * 1024 }
}).single('audio');

const scanImageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`File type ${file.mimetype} is not allowed for grammar scan.`);
    error.statusCode = 400;
    cb(error, false);
  }
};

const uploadGrammarScanPages = multer({
  storage: multer.memoryStorage(),
  fileFilter: scanImageFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_GRAMMAR_SCAN_PAGE_SIZE, 10) || 10 * 1024 * 1024,
    files: parseInt(process.env.MAX_GRAMMAR_SCAN_PAGES, 10) || 8
  }
}).array('pages', parseInt(process.env.MAX_GRAMMAR_SCAN_PAGES, 10) || 8);

module.exports = { uploadImage, uploadAudio, uploadGrammarScanPages };
