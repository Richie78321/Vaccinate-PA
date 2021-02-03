import { Typeahead } from "react-bootstrap-typeahead";
import counties from "../content/counties";
import { useRouter } from "next/router";

export default function CountySearch({ searchRef }) {
  const router = useRouter();

  return (
    <Typeahead
      id="county-filter-selection"
      ref={searchRef}
      placeholder="Search for your county..."
      options={counties}
      onChange={(selected) => {
        if (selected && selected.length > 0) {
          router.push(`counties/${selected[0].replace(" ", "_")}`);
        }
      }}
      clearButton
    />
  );
}
