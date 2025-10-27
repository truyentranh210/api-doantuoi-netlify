exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "👋 Welcome to AI JSON API on Netlify!",
      endpoints: {
        "/doantuoi?url={image_link}": "Phân tích ảnh khuôn mặt và đoán tuổi",
        "/time?country={country_name}": "Lấy thời gian hiện tại của quốc gia"
      }
    }, null, 2),
    headers: { "Content-Type": "application/json" }
  };
};
