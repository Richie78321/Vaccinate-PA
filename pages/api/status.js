export default async function handler(req, res) {
  res.json({
    dataSource: process.env.ARCHIVE_MODE === "true" ? "Google Sheets" : "Airtable",
  })
}