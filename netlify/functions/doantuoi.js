const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  const params = new URLSearchParams(event.rawQuery);
  const url = params.get("url");

  if (!url) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "error",
        message: "Thiếu tham số ?url=",
        example: "/doantuoi?url=https://example.com/face.jpg"
      })
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Hãy đoán độ tuổi trung bình của người trong ảnh này (chỉ trả về số tuổi, không giải thích)." },
            { type: "image_url", image_url: { url } } // ✅ Đã fix cú pháp
          ]
        }
      ]
    });

    const ageGuess = completion.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "success",
        message: "Đoán tuổi thành công!",
        data: {
          image: url,
          predicted_age: ageGuess
        }
      }, null, 2)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "error",
        message: "Lỗi xử lý AI",
        detail: err.message
      })
    };
  }
};
