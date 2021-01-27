export default function AirTable({ county }) {
  let airtableURL =
    "https://airtable.com/embed/shr1fCiGy7sVnNixq?backgroundColor=grayLight&viewControls=on";
  if (county && county.length > 0) {
    airtableURL += `&filter_County=${county}`;
  }

  return (
    <>
      <iframe
        title="All County Airtable Embed"
        src={airtableURL}
        frameBorder="0"
        width="100%"
        height="100%"
        style={{ height: "85vh" }}
        className="airtable-embed"
      />
    </>
  );
}
