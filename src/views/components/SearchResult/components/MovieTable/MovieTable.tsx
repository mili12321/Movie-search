import { useState, useEffect } from "react";
import { Skeleton } from "../../../Skeleton/Skeleton";
import "./MovieTable.scss";

type Movie = {
  Title: string;
  Year: number;
  imdbID: string;
  [key: string]: string | number;
};

type Data = {
  movies: Movie[];
  perPage: number;
};

type SortConfig = {
  key: string | null;
  direction: "asc" | "desc";
};

type MovieTableProps = {
  data: Data;
  isLoading: boolean;
  url: string;
};

type TableProps = {
  movies: Movie[];
  isLoading: boolean;
  sortTable: (key: string) => void;
  sortConfig: SortConfig;
};

type SortingArrowsProps = {
  sortConfig: SortConfig;
  sortKey: string;
};

export const MovieTable = ({ data, isLoading, url }: MovieTableProps) => {
  const { movies, perPage } = data;
  const [sortedMovies, setSortedMovies] = useState<Movie[]>(movies);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    setSortedMovies(movies);
  }, [movies]);

  useEffect(() => {
    setSortConfig({ key: null, direction: "asc" });
  }, [url]);

  const sortTable = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...sortedMovies].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (direction === "asc") {
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        } else {
          return (aValue as number) - (bValue as number);
        }
      } else {
        if (typeof aValue === "string" && typeof bValue === "string") {
          return bValue.localeCompare(aValue);
        } else {
          return (bValue as number) - (aValue as number);
        }
      }
    });

    setSortedMovies(sortedData);
  };

  if ((!sortedMovies || !perPage) && !isLoading)
    return <div>No Data Available</div>;
  if (sortedMovies && sortedMovies.length === 0)
    return <div className="error-message">No Movies Found</div>;
  return (
    <Table
      movies={sortedMovies}
      isLoading={isLoading}
      sortTable={sortTable}
      sortConfig={sortConfig}
    />
  );
};

export const Table = ({
  movies,
  isLoading,
  sortTable,
  sortConfig,
}: TableProps) => {
  return (
    <table className="movie-table">
      <thead>
        <tr>
          <th onClick={() => sortTable("Title")}>
            <div className="title-container">
              <span>Title</span>
              <SortingArrows sortConfig={sortConfig} sortKey={"Title"} />
            </div>
          </th>
          <th onClick={() => sortTable("Year")}>
            <div className="title-container">
              <span>Year</span>
              <SortingArrows sortConfig={sortConfig} sortKey={"Year"} />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? Array.from({ length: 10 }).map((_, idx) => {
              return (
                <tr key={idx}>
                  <th>
                    <Skeleton />
                  </th>
                  <td>
                    <Skeleton />
                  </td>
                </tr>
              );
            })
          : movies.map((movie) => {
              const { Title, Year, imdbID } = movie;
              return (
                <tr key={imdbID}>
                  <th>{Title}</th>
                  <td>{Year}</td>
                </tr>
              );
            })}
      </tbody>
    </table>
  );
};

const SortingArrows = ({ sortConfig, sortKey }: SortingArrowsProps) => {
  return (
    <span className="sorting-arrows">
      <div
        className={`${
          sortConfig.key === sortKey && sortConfig.direction === "asc"
            ? "active"
            : ""
        }`}
      >
        &#11165;
      </div>
      <div
        className={`${
          sortConfig.key === sortKey && sortConfig.direction === "desc"
            ? "active"
            : ""
        }`}
      >
        &#11167;
      </div>
    </span>
  );
};
