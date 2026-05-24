const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};

module.exports = { uploadImage };