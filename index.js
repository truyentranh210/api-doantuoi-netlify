import express from "express";
import fetch from "node-fetch";

const app = express();

// 🏠 Trang chủ
app.get("/", (req, res) => {
  res.json({
    message: "👋 Welcome to Age-Time API!",
    usage: {
      "/doantuoi?url={image_link}": "AI đoán tuổi từ ảnh khuôn mặt hoặc cơ thể",
      "/time?country={country_name}": "Lấy thời gian hiện tại của quốc gia (viết tắt hoặc đầy đủ)"
    }
  });
});

// 🤖 API đoán tuổi (dựa trên ảnh)
app.get("/doantuoi", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ error: "Thiếu tham số ?url=" });

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/nateraw/age-detection", {
      method: "POST",
      headers: {
        "Authorization": "Bearer hf_xxxxxxxxxxxxxxx", // Thay token HuggingFace của bạn
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: url })
    });
    const data = await response.json();

    // Kết quả
    res.json({
      input: url,
      predicted_age: data?.[0]?.label || "Không xác định",
      confidence: data?.[0]?.score || null
    });
  } catch (e) {
    res.json({ error: e.message });
  }
});

// 🌍 API lấy thời gian của quốc gia
app.get("/time", async (req, res) => {
  const { country } = req.query;
  if (!country) return res.json({ error: "Thiếu tham số ?country=" });

  try {
    const response = await fetch(`https://worldtimeapi.org/api/timezone`);
    const timezones = await response.json();

    // Tìm timezone khớp với tên quốc gia
    const found = timezones.find(tz =>
      tz.toLowerCase().includes(country.toLowerCase())
    );

    if (!found)
      return res.json({ error: `Không tìm thấy quốc gia: ${country}` });

    const timeData = await fetch(`https://worldtimeapi.org/api/timezone/${found}`);
    const timeJson = await timeData.json();

    res.json({
      country,
      timezone: found,
      datetime: timeJson.datetime
    });
  } catch (e) {
    res.json({ error: e.message });
  }
});

// ✅ Cổng chạy local (Netlify tự nhận cổng khi deploy)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 API running on port ${port}`));
