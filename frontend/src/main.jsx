import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// This is the entry point of the React app.
// It mounts the main App component into the div#root in index.html.

const rootElement = document.getElementById("root");

// Safety check (in case root div is missing)
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);