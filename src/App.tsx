import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Tv from "./Components/Tv";
import New from "./Components/New";
import Search from "./Components/Search";


function App() {
  return(
    <Router>
      <Header />
      <Routes>
        <Route path="/*" element={<Home />} /> 
        <Route path="tv/*" element={<Tv />} />
        <Route path="search/*" element={<Search />} />
        <Route path="new" element={<New />} />
      </Routes>
  </Router>
  );
}

export default App;
