const express = require("express");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const { db } = require("./firebase");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 提供 public 資料夾靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "addProduct.html"));
});

const IMGBB_KEY = process.env.IMGBB_KEY;

// memoryStorage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 上傳商品路由
app.post("/upload", upload.single("picture"), async (req, res) => {
  try {
    const { name, condition, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).send("沒有圖片");

    // 轉 Base64
    const base64Image = file.buffer.toString("base64");

    // 上傳到 ImgBB
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
      new URLSearchParams({
        image: base64Image,
        name: file.originalname
      })
    );

    const imageURL = response.data.data.url;

    // 存 Firestore
    await db.collection("products").add({
      name,
      condition,
      description,
      picture: imageURL,
      createdAt: new Date()
    });

    // 回傳結果給前端
    res.json({
      message: "上傳成功",
      imageURL
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("上傳失敗：" + error.message);
  }
});

// 啟動服務
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.error(error);

