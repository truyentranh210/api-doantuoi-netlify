// ============================================================
// 🤖 ĐOÁN TUỔI BẰNG GPT-4o
// ============================================================
import OpenAI from "openai";

// 🔑 Kết nối OpenAI bằng API key trong Netlify Environment
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================
// 🔹 HÀM CHÍNH CỦA API
// ============================================================
export async function handler(event) {
  const params = new URLSearchParams(event.rawQuery);
  const url = params.get("url");

  // 🧩 Kiểm tra tham số
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Thiếu tham số ?url=",
        example: "/doantuoi?url=https://example.com/face.jpg",
      }),
    };
  }

  try {
    // 🚀 Gọi GPT-4o Vision để đoán tuổi
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Đoán độ tuổi trung bình của người trong ảnh (chỉ trả về con số tuổi)." },
            { type: "image_url", image_url: url },
          ],
        },
      ],
    });

    // 📤 Trả về kết quả
    return {
      statusCode: 200,
      body: JSON.stringify({
        image: url,
        predicted_age: completion.choices[0].message.content,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
