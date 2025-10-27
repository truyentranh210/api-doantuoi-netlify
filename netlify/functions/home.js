exports.handler = async () => {
  const info = {
    status: "success",
    message: "👋 Welcome to AI JSON API on Netlify!",
    author: "Your Name",
    endpoints: {
      "/doantuoi?url={image_link}": "Đoán tuổi từ ảnh (bằng OpenAI GPT-4o Vision)",
      "/time?country={country_name}": "Lấy thời gian hiện tại theo quốc gia",
      "/home": "Trang hướng dẫn API"
    }
  };

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(info, null, 2)
  };
};
