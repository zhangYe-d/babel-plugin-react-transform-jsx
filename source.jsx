import * as React from "./node_modules/react/index.js";
import createRoot from "./node_modules/react-dom/index.js";

const string = "hello";

const App = () => {
  return (
    <h1 className="app" style={{ color: "lightblue" }}>
      {string}worl d
    </h1>
  );
};

createRoot(document.querySelector("#id")).render(<App />);
