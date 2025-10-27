import React from "react";
import ImageUploader from "./components/ImageUploader";

export default function App() {
  return (
    <div className="app-root">
      <header>
        <h1>Visibuy Product Verification Upload</h1>
        <p className="subtitle">Upload up to 5 product images (JPEG / PNG)</p>
      </header>

      <main>
        <ImageUploader maxFiles={5} />
      </main>

      <footer className="footer">
        <small>Built with React Hooks </small>
      </footer>
    </div>
  );
}
