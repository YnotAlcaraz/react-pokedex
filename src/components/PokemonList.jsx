import { useEffect, useState } from "react";
import { getPokemonPage, getPokemons } from "../services/pokemonServices";
import PokemonCard from "./PokemonCard";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousUrl, setPreviousUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");

  useEffect(() => {
    const fetchPokemons = async () => {
      const pokemonResponse = await getPokemons();
      setPokemonList(pokemonResponse.results);
      setPreviousUrl(pokemonResponse.previous);
      setNextUrl(pokemonResponse.next);
    };
    fetchPokemons();
  }, []);

  const onPreviousPage = async () => {
    setCurrentPage(currentPage - 1);
    const pokemonResponse = await getPokemonPage(previousUrl);
    setPreviousUrl(pokemonResponse.previous);
    setNextUrl(pokemonResponse.next);
    setPokemonList(pokemonResponse.results);
  };

  const onNextPage = async () => {
    setCurrentPage(currentPage + 1);
    const pokemonResponse = await getPokemonPage(nextUrl);
    setPreviousUrl(pokemonResponse.previous);
    setNextUrl(pokemonResponse.next);
    setPokemonList(pokemonResponse.results);
  };

  return (
    <>
      <div className="page_counter">
        {currentPage > 1 ? (
          <>
            <button onClick={onPreviousPage}>{"<"}</button>
            <p className="page_counter_other_pages">{currentPage - 1}</p>
          </>
        ) : null}
        <p className="page_counter_currentPage">{currentPage}</p>
        <p className="page_counter_other_pages">{currentPage + 1}</p>
        <button onClick={onNextPage}>{">"}</button>
      </div>
      <div className="pokemon_list">
        {pokemonList?.map((pokemon, index) => {
          return (
            <PokemonCard
              key={index}
              pokemonName={pokemon.name}
              pokemonImageUrl={pokemon.url}
            />
          );
        })}
      </div>
    </>
  );
};

export default PokemonList;
