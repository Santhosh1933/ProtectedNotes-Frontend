import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Notes } from "./pages/Notes";
import { NewNotes } from "./pages/NewNotes";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="edit/:name" element={<NewNotes />} />
          <Route path="/:name" element={<Notes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
