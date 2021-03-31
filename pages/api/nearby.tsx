import { getNearbyLocations } from "../../utils/Data";

function getNumber(floatString: string): number {
  if (!floatString) {
    return NaN;
  }

  return parseFloat(floatString);
}

const DEFAULT_DISTANCE = 15;

export default async function handler(req, res) {
  let {
    query: { lat, long, distance },
  } = req;

  distance = getNumber(distance);

  if (isNaN(distance)) {
    distance = DEFAULT_DISTANCE;
  }

  lat = getNumber(lat);
  long = getNumber(long);

  if (isNaN(lat) || isNaN(long)) {
    res.status(400).json({
      status: 400,
      message: "Invalid location. Expects valid (lat)itude (long)itude query parameters.",
    });

    return;
  }

  res.status(200).json({
    status: 200,
    message: `Received locations within ${distance} miles.`,
    locations: await getNearbyLocations(lat, long, distance),
  });
}