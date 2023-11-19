import { useFetch } from "../../../data/hooks/useFetch.js";
import "./SearchResult.scss";
import { MovieTable } from "./components/MovieTable/MovieTable.js";
import { Pagination } from "./components/Pagination/Pagination.js";

type Props = {
  url: string;
  setUrl: (url: string) => void;
};
export const SearchResult = ({ url, setUrl }: Props) => {
  const { response, isLoading, error } = useFetch(url);

  if (error) return <div>Error occurred: {error.message}</div>;
  return (
    <section className="search-results-container">
      <MovieTable
        data={{ movies: response?.data, perPage: response?.per_page }}
        isLoading={isLoading}
        url={url}
      />
      <Pagination
        data={{ currentPage: response?.page, total: response?.total_pages }}
        setUrl={setUrl}
        url={url}
      />
    </section>
  );
};
