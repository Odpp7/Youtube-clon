import SearchContent from "./searchContent";

export default function SearchPage({ searchParams }) {
  const query = searchParams.q || "";
  return <SearchContent query={query} />;
}
