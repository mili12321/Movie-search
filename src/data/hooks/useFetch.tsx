/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer } from "react";

type Movie = {
  Title: string;
  Year: number;
  imdbID: string;
};

type Response = {
  data: Movie[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  timestamp?: number;
};

type State = {
  response: any;
  isLoading: boolean;
  error: any;
};

type Action = {
  type: string;
  response?: Response;
  error?: any;
};

function reducer(state: State, { type, response, error }: Action) {
  switch (type) {
    case "loading":
      return { ...state, isLoading: true };
    case "success":
      return { response, isLoading: false, error: null };
    case "error":
      return { response: null, isLoading: false, error };
    default:
      throw new Error("unknown action type");
  }
}

const cache: { [key: string]: Response } = {}; // Object to store cached data

const cleanUpCache = () => {
  const now = Date.now();

  for (const key in cache) {
    if (Object.prototype.hasOwnProperty.call(cache, key)) {
      const timestamp = cache[key].timestamp;
      if (timestamp && now - timestamp > 600000) {
        // Remove the item from the cache
        delete cache[key];
      }
    }
  }
};

export function useFetch(url: string): State {
  const [state, dispatch] = useReducer(reducer, {
    response: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let shouldCancel = false;

    const fetchData = async (): Promise<void> => {
      dispatch({ type: "loading" });

      try {
        // Check if the data is already in the cache
        if (cache[url]) {
          dispatch({ type: "success", response: cache[url] });
        } else {
          const res = await fetch(url);
          const response = await res.json();

          // Update the cache with the new data
          cache[url] = { ...response, timestamp: Date.now() };
          if (shouldCancel) return;
          dispatch({ type: "success", response });
        }
      } catch (error) {
        if (shouldCancel) return;
        dispatch({ type: "error", error });
      }
    };

    // Clean up the cache every 10 minutes
    const cacheCleanupInterval = setInterval(cleanUpCache, 600000);

    fetchData();

    return () => {
      shouldCancel = true;
      clearInterval(cacheCleanupInterval);
    };
  }, [url]);

  return state;
}
