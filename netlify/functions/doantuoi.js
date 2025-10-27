import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event) => {
  const params = new URLSearchParams(event.rawQuery);
  const url = params.get("url");
  if (!url)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Thiếu tham số ?url=" }),
    };

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Hãy đoán độ tuổi ước tính của người trong ảnh này (chỉ trả về số tuổi).",
            },
            { type: "image_url", image_url: url },
          ],
        },
      ],
    });

    const guess = completion.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ image: url, predicted_age: guess }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
