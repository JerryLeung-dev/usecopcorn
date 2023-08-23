import { useEffect, useState } from "react";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const KEY = "c0a8a8b7";
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        fetchMovies();
    
        async function fetchMovies() {
          try {
            setError("");
            if (query.length < 3) {
              setMovies([]);
              return;
            }
            setLoading(true);
            const res = await fetch(
              `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
              {
                signal: signal,
              }
            );
    
            // if(!res || !res.ok)
            //   throw new Error("Something went wrong with movies");
    
            const data = await res.json();
    
            if (data.Response === "False") throw new Error("Movie not found");
            setMovies(data.Search);
            // setError("");
          } catch (error) {
            if (error.name !== "AbortError") {
              setError(error.message);
            }
          } finally {
            setLoading(false);
          }
          return () => {
            controller.abort();
          };
        }
      }, [query]);
    return {movies, isLoading, error}
}