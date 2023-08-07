import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import './index.css';
// import App from './App';
import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));

function TestFunc() {
  const [rate, setRate] = useState(0);
  return (
    <div>
      <StarRating className="test" messages={["Bad", "Neutral", "Good"]} onSetRate={setRate}/>
      <p>You have received {rate} stars</p>
    </div>
  );
}

root.render(
  <React.StrictMode>
    {/* <App /> */}
    <TestFunc />
    {/* <StarRating className="test" messages={["Bad", "Neutral", "Good"]} /> */}
  </React.StrictMode>
);
