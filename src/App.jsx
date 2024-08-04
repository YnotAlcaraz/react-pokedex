import React, { useState } from "react";
import "./App.css";
import Header from "./components/header";
import PokemonList from "./components/PokemonList";

export const context = React.createContext();

function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <context.Provider value={[searchValue, setSearchValue]}>
      <Header />
      <PokemonList />
    </context.Provider>
  );
}

export default App;
