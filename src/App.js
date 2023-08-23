import { useState } from "react";
import { NavBar, NumResults, Search } from "./Navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import Main, {
  Box,
  MovieList,
  WatchedSummary,
  WatchedMoviesList,
  MovieDetails,
} from "./Main";
import { useEffect } from "react";
import { Spinner } from "./Main";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedimdbID, setSelectedimdbID] = useState(null);

  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function() {
  //   let storedValue = localStorage.getItem('watched');
  //   storedValue = storedValue !== null ? storedValue : "[]";
  //   return JSON.parse(storedValue);
  // });

  const [watched, setWatched] = useLocalStorageState([], "watched");

  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched))
  // },[watched])

  const { movies, isLoading, error} = useMovies(query);

  function handleQuery(query) {
    setQuery(query);
  }

  function handleSelectedimdbID(id) {
    //selectedId is the current value of the selected imdbID
    setSelectedimdbID((selectedId) => (id === selectedId ? null : id));
  }

  function handleAddToList(watchedMovie) {
    setWatched((watched) => [...watched, watchedMovie]);
  }

  function handleDeleteWatchedMovie(watchedMovieId) {
    setWatched((watched) => {
      return watched.filter((movie) => movie.imdbID !== watchedMovieId);
    });
  }

  return (
    <>
      <NavBar>
        <Search onQuery={handleQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Spinner />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectedimdbID} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedimdbID !== null ? (
            <>
              <button
                onClick={() => handleSelectedimdbID(null)}
                className="btn-back"
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  size="sm"
                  style={{ color: "#343a40" }}
                />
              </button>
              <MovieDetails
                movieId={selectedimdbID}
                onAddToList={handleAddToList}
                onSelectImdbID={handleSelectedimdbID}
                watched={watched}
              />
            </>
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                watchedMovieId={selectedimdbID}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      🛑{" "}
      {message === "Failed to fetch"
        ? "Something went wrong with movies"
        : message}{" "}
    </p>
  );
}
