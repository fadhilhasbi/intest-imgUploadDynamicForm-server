const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.array("images"), (req, res) => {
  try {
    const imagePaths = req.files.map((file) => ({
      path: `/uploads/${file.filename}`,
      label: req.body.labels ? req.body.labels[req.files.indexOf(file)] : "",
    }));

    res.status(200).json({ message: "Upload successful", images: imagePaths });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

app.use("/uploads", express.static(uploadDirectory));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
