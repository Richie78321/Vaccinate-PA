import { countyCodes } from "../../../../content/counties";
import "../../../../realtime-api/realtimeData";
import { getCounty } from "../../../../realtime-api/realtimeData";

export default async function handler(req, res) {
  let {
    query: { county },
  } = req;

  county = county.toLowerCase();

  if (!countyCodes.includes(county)) {
    res.status(400).json({
      status: 400,
      message: "Unknown county code.",
    });

    return;
  }

  res.status(200).json({
    status: 200,
    message:
      "Retrieved real-time county data. For scrapers, please use the public https://www.vaccinespotter.org/api/.",
    locations: await getCounty(county),
  });
}
