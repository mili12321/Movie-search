import { useState } from "react";
import { Search } from "./components/Search/Search";
import { SearchResult } from "./components/SearchResult/SearchResult";

function App() {
  const [url, setUrl] = useState("");

  return (
    <>
      <h1> Movies search</h1>
      <p>Search for any movie you like:</p>
      <Search setUrl={setUrl} />

      {url && <SearchResult url={url} setUrl={setUrl} />}
    </>
  );
}

export default App;
