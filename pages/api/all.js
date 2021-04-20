import rateLimit from "express-rate-limit";
import { getAllLocationsPreprocessed } from "../../utils/Data";

const requiredResponseFields = ["status", "message", "locations"];
const requiredLocationFields = ["id", "fields", "Name", "Phone number", "Website", "County", "Latitude", "Longitude", "Latest report", "Vaccines available?", "Latest report notes", "Address", "isActiveSupersite"];

const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25,
  handler: (req, res) => {
    // 429 status = Too Many Requests (RFC 6585)
    res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
  },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      
      console.log(result);
      return resolve(result);
    })
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, rateLimiter);
  
  res.status(200).send(JSON.stringify({ 
    status: 200,
    message: "Retrieved all VaccinatePA data.",
    locations: await getAllLocationsPreprocessed(),
  }, [...requiredResponseFields, ...requiredLocationFields]));
  res.setHeader("Content-Type", "application/json");
}