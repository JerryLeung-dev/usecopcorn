import { useState } from "react";
import { useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "c0a8a8b7";

export default function Main({ children }) {
  return <main className="main">{children}</main>;
}

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

export function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

export function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

export function WatchedBox({ children }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && children}
    </div>
  );
}

export function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));


  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

export function WatchedMoviesList({
  watched,
  watchedMovieId,
  onDeleteWatchedMovie,
}) {
  return (
    <ul className="list list-movies">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
      {/* {watchedMovieId} */}
    </ul>
  );
}

export function WatchedMovie({ movie, onDeleteWatchedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button
        className="btn-delete"
        onClick={() => onDeleteWatchedMovie(movie.imdbID)}
      >
        x
      </button>
    </li>
  );
}

export function Spinner() {
  return <p>Loading...</p>;
}

export function MovieDetails({
  movieId,
  onAddToList,
  onSelectImdbID,
  watched,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);

  const {
    imdbRating,
    Title: title,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbID,
  } = movieDetails;

  useKey("Escape", () => onSelectImdbID(null));

  useEffect(() => {
    if(userRating) countRef.current++;
  }, [userRating]);

  useEffect(() => {
    async function fetchMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?&apikey=${KEY}&i=${movieId}`
      );
      const data = await res.json();
      setMovieDetails(data);
      setIsLoading(false);
    }

    fetchMovieDetails();
  }, [movieId]);

  useEffect(() => {
    if(!title) return;
    document.title = `Movie | ${title}`;
    return () => {
      document.title = 'Rateflix';
    }
  },[title]);

  function handleAddToList() {
    const watchedMovie = {
      title,
      runtime: Number(runtime.split(" ")[0]),
      imdbRating,
      poster,
      userRating,
      userRatingCount: countRef.current,
      imdbID,
    };
    onAddToList(watchedMovie);
    onSelectImdbID(null);
  }

  function handleSetRate(newRate) {
    setUserRating(newRate);
  }

  return (
    <div className="details">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <header>
            <img src={poster} alt={`Poster of ${movieDetails} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {watched.map((movie) => movie.imdbID).includes(movieId) ? (
                <span>
                  Your movie was rated with : &nbsp;
                  {
                    watched.filter(
                      (watchedMovie) => watchedMovie.imdbID === movieId
                    )[0]?.userRating
                  }
                  <span>⭐</span>
                </span>
              ) : (
                <>
                  <StarRating
                    size={24}
                    maxRating={10}
                    onSetRate={handleSetRate}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddToList}>
                      Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
