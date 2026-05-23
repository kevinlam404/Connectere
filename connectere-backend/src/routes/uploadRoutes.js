const express = require("express");
const multer = require("multer");
const path = require("path");

//Upload images
const {
  uploadImage,
} = require("../controllers/uploadController");

const router = express.Router();


//MulterStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


// Route
router.post(
  "/image",
  upload.single("image"),
  uploadImage
);

module.exports = router;