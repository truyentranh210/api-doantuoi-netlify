const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.rawQuery);
    const country = params.get("country");

    // Nếu có tham số country => chỉ trả về 1 quốc gia
    if (country) {
      const response = await fetch(`https://timeapi.io/api/Time/current/country?country=${encodeURIComponent(country)}`);
      if (!response.ok) {
        return {
          statusCode: 404,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "error",
            message: `Không tìm thấy quốc gia: ${country}`
          })
        };
      }

      const data = await response.json();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "success",
          message: `Lấy thời gian quốc gia ${data.countryName} thành công!`,
          data: {
            country: data.countryName,
            timezone: data.timeZone,
            datetime: data.dateTime,
            date: data.date,
            time: data.time,
            dayOfWeek: data.dayOfWeek
          }
        }, null, 2)
      };
    }

    // Nếu KHÔNG có country => trả về danh sách toàn bộ múi giờ
    const zoneListResp = await fetch("https://timeapi.io/api/TimeZone/AvailableTimeZones");
    const zones = await zoneListResp.json();

    // Lấy ngẫu nhiên 60 zone tiêu biểu để tránh timeout (Netlify giới hạn 10s)
    const limitedZones = zones.slice(0, 60);

    // Gọi đồng thời tất cả timezone
    const promises = limitedZones.map(async (zone) => {
      try {
        const r = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${zone}`);
        const data = await r.json();
        return {
          timezone: zone,
          datetime: data.dateTime,
          date: data.date,
          time: data.time,
          dayOfWeek: data.dayOfWeek
        };
      } catch {
        return null;
      }
    });

    const results = (await Promise.all(promises)).filter(Boolean);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "success",
        message: "Lấy toàn bộ thời gian các quốc gia thành công!",
        count: results.length,
        data: results
      }, null, 2)
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "error",
        message: "Lỗi khi lấy danh sách thời gian",
        detail: err.message
      })
    };
  }
};
