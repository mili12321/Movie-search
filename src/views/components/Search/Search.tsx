import React, { useState, useEffect, useCallback } from "react";
import search from "../../../assets/icons/search.svg";
import "./Search.scss";

const URL = "https://jsonmock.hackerrank.com/api/movies/search";

type Props = {
  setUrl: (url: string) => void;
};

export const Search = ({ setUrl }: Props) => {
  const [value, setValue] = useState("");
  const [shouldShowErrorMsg, setShouldShowErrorMsg] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    setShouldShowErrorMsg(false);
  }

  const searchMovie = useCallback(() => {
    const cleanValue = value.replace(/\s+/g, " ").trim();
    const newUrl = `${URL}?Title=${cleanValue}&page=1`;
    setUrl(newUrl);
  }, [setUrl, value]);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        if (!value) {
          setShouldShowErrorMsg(true);
          return;
        }
        e.preventDefault();
        searchMovie();
      }
    };
    document.addEventListener("keydown", onKeyPress);
    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [searchMovie, value]);

  return (
    <section className="search-section">
      <div className="input-wrapper">
        <img src={search} alt="" />
        <input
          type="text"
          name="Title"
          placeholder="Type movie name..."
          value={value}
          onChange={handleChange}
        />
        <button className="button" disabled={!value} onClick={searchMovie}>
          Search
        </button>
      </div>
      {shouldShowErrorMsg && (
        <div className="error-message">
          Please type movie title in the search
        </div>
      )}
    </section>
  );
};
