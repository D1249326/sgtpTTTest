const express = require("express");
const axios = require("axios");
const multer = require("multer");
const { db } = require("./firebase");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // 提供前端檔案

const IMGBB_KEY = process.env.IMGBB_KEY;

// 使用 memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("picture"), async (req, res) => {
  try {
    const { name, condition, description } = req.body;
    const file = req.file;
    if (!file) return res.status(400).send("沒有圖片");

    const base64Image = file.buffer.toString("base64");

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
      new URLSearchParams({
        image: base64Image,
        name: file.originalname
      })
    );

    const imageURL = response.data.data.url;

    await db.collection("products").add({
      name,
      condition,
      description,
      picture: imageURL,
      createdAt: new Date()
    });

    res.json({ message: "上傳成功", imageURL });
  } catch (error) {
    console.error(error);
    res.status(500).send("上傳失敗：" + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
