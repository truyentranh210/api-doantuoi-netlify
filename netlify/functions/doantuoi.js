const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Đúng tên biến
});

exports.handler = async (event) => {
  const params = new URLSearchParams(event.rawQuery);
  const url = params.get("url");

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Thiếu tham số ?url=",
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
            { type: "text", text: "Đoán độ tuổi trung bình của người trong ảnh (chỉ trả về con số)." },
            { type: "image_url", image_url: url }
          ]
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        image: url,
        predicted_age: completion.choices[0].message.content
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
