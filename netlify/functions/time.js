const fetch = require("node-fetch");

exports.handler = async (event) => {
  const params = new URLSearchParams(event.rawQuery);
  const country = params.get("country");

  if (!country) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "error",
        message: "Thiếu tham số ?country=",
        example: "/time?country=vietnam"
      })
    };
  }

  try {
    // ✅ API ổn định hơn worldtimeapi.org
    const resp = await fetch("https://timeapi.io/api/TimeZone/AvailableTimeZones");
    const zones = await resp.json();

    const match = zones.find(z => z.toLowerCase().includes(country.toLowerCase()));

    if (!match) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "error",
          message: `Không tìm thấy quốc gia: ${country}`
        })
      };
    }

    const timeResp = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${match}`);
    const data = await timeResp.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "success",
        message: "Lấy thời gian thành công!",
        data: {
          country,
          timezone: match,
          datetime: data.dateTime,
          date: data.date,
          time: data.time,
          dayOfWeek: data.dayOfWeek
        }
      }, null, 2)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "error",
        message: "Lỗi khi truy cập Time API",
        detail: err.message
      })
    };
  }
};
