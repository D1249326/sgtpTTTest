const axios = require("axios");
const upload = require("./upload");
const { db } = require("./firebase");

const IMGBB_KEY = process.env.IMGBB_KEY;

app.post("/upload", upload.single("picture"), async (req, res) => {
  try {
    const { name, condition, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).send("沒有圖片");

    // ✅ 轉 Base64
    const base64Image = file.buffer.toString("base64");

    // ✅ 上傳到 ImgBB
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
      new URLSearchParams({
        image: base64Image
      })
    );

    const imageURL = response.data.data.url;

    // ✅ 存 Firestore
    await db.collection("products").add({
      name,
      condition,
      description,
      picture: imageURL,
      createdAt: new Date()
    });

    res.json({
      message: "上傳成功",
      imageURL
    });

  } catch (error) {
    res.status(500).send("上傳失敗：" + error.message);
  }
});
