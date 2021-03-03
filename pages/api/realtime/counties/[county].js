import { countyCodes } from '../../../../content/counties';
 
export default function handler(req, res) {
  let {
    query: { county },
  } = req;

  county = county.toLowerCase();

  if (!countyCodes.includes(county)) {
    res.status(400).json({
      status: 400,
      message: "Unknown county code.",
    });
  }

  res.status(200).end("Valid county code.");
}