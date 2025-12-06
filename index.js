const express = require("express");
const path = require("path");
const axios = require("axios");
const multer = require("multer");
const { db } = require("./firebase");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "addProduct.html"));
});

app.post("/upload", upload.single("picture"), async (req, res) => {
  // 上傳邏輯
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
