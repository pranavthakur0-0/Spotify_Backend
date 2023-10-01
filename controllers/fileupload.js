const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'song') {
      cb(null, 'uploads/songs');
    } else {
      cb(new Error('Invalid field name'));
    }
  },
  filename: (req, file, cb) => {
    const currentDate = new Date();
    const newName = `${currentDate.getTime()}.${file.mimetype.split('/')[1]}`;
    if (file.fieldname === 'image') {
      req.imageName = newName;
    } else if (file.fieldname === 'song') {
      req.songName = newName;
    }
    cb(null, newName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image' && (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')) {
    cb(null, true);
  } else if (file.fieldname === 'song' && (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'song', maxCount: 1 }
]);

module.exports = { upload };
