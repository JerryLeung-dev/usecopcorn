import { useRef, useEffect } from "react";

export function NavBar({children}) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}

export function Logo() {
  return (
    <div className="logo">
      <span role="img">🎥</span>
      <h1>RateFlix</h1>
    </div>
  );
}

export function NumResults({movies}) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

export function Search({onQuery}) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          onQuery("");
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
    },
    [onQuery]
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      onChange={(e) => onQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
