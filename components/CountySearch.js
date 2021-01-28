import { Typeahead } from "react-bootstrap-typeahead"
import counties from "../content/counties"
import { useRouter } from "next/router"

export default function CountySearch() {
  const router = useRouter();

  return (
    <Typeahead
      id="county-filter-selection"
      placeholder="Search by county..."
      options={counties}
      onChange={(selected) => {
        if (selected && selected.length > 0) {
          router.push(`counties/${selected[0].replace(" ", "_")}`);
        }
      }}
      clearButton
    />
  )
}
