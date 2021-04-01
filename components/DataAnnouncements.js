import { InlineShareButtons } from "sharethis-reactjs";

export default function DataAnnouncements({ sharethisConfig }) {
  return (
    <>
      <p className="text-center">
        <a href="https://forms.gle/5vyDk2tTjYUTMTXu6">Volunteer with us!</a>
      </p>
      <div className="mb-3">
        <InlineShareButtons config={sharethisConfig} />
      </div>
    </>
  );
}
