const fetch = require("node-fetch");

exports.handler = async (event) => {
  const params = new URLSearchParams(event.rawQuery);
  const country = params.get("country");

  if (!country) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Thiếu tham số ?country=",
        example: "/time?country=vietnam"
      })
    };
  }

  try {
    const resp = await fetch("https://worldtimeapi.org/api/timezone");
    const zones = await resp.json();

    const match = zones.find(z => z.toLowerCase().includes(country.toLowerCase()));
    if (!match) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: `Không tìm thấy quốc gia: ${country}` })
      };
    }

    const timeResp = await fetch(`https://worldtimeapi.org/api/timezone/${match}`);
    const data = await timeResp.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        country,
        timezone: match,
        datetime: data.datetime
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
