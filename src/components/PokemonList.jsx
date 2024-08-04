import { useEffect, useState } from "react";
import {
  getPokemon,
  getPokemonPage,
  getPokemons,
} from "../services/pokemonServices";
import PokemonCard from "./PokemonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import PageCounter from "./PageCounter";

const PokemonList = ({ searchValue }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousUrl, setPreviousUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);

  //TODO: Buscador, diseño, guardar data en caché

  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true);
      const pokemonResponse = await getPokemons();
      setPokemonList(pokemonResponse.results);
      setFilteredPokemonList(pokemonResponse.results);
      setPreviousUrl(pokemonResponse.previous);
      setNextUrl(pokemonResponse.next);
      setIsLoading(false);
    };
    fetchPokemons();
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoading(true);
      const pokemonResponse = await getPokemon(searchValue);
      pokemonResponse
        ? setFilteredPokemonList([pokemonResponse.data])
        : setFilteredPokemonList([]);
      setIsLoading(false);
    };
    if (searchValue.length > 0) {
      fetchPokemon();
    } else {
      setFilteredPokemonList(pokemonList);
      setIsLoading(false);
      9;
    }
  }, [searchValue]);

  const onPreviousPage = async () => {
    setIsLoading(true);
    setCurrentPage(currentPage - 1);
    const pokemonResponse = await getPokemonPage(previousUrl);
    setPreviousUrl(pokemonResponse.previous);
    setNextUrl(pokemonResponse.next);
    setPokemonList(pokemonResponse.results);
    setFilteredPokemonList(pokemonResponse.results);
    setIsLoading(false);
  };

  const onNextPage = async () => {
    setIsLoading(true);
    setCurrentPage(currentPage + 1);
    const pokemonResponse = await getPokemonPage(nextUrl);
    setPreviousUrl(pokemonResponse.previous);
    setNextUrl(pokemonResponse.next);
    setPokemonList(pokemonResponse.results);
    setFilteredPokemonList(pokemonResponse.results);
    setIsLoading(false);
  };

  return (
    <>
      {searchValue.trim().trim().length > 0 ? (
        <h2 className="search_value">Resultados de: {searchValue}</h2>
      ) : (
        <PageCounter
          currentPage={currentPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          nextUrl={nextUrl}
        />
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="pokemon_list">
          {filteredPokemonList.length > 0 ? (
            filteredPokemonList?.map((pokemon, index) => {
              return (
                <PokemonCard
                  key={index}
                  pokemonName={pokemon.name}
                  pokemonImageUrl={pokemon.url}
                />
              );
            })
          ) : (
            <h1>No se encontraron resultados</h1>
          )}
        </div>
      )}

      {searchValue.trim().trim().length <= 0 && !isLoading ? (
        <div className="page_counter">
          {currentPage > 1 ? (
            <>
              <button onClick={onPreviousPage}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <p className="page_counter_other_pages">{currentPage - 1}</p>
            </>
          ) : null}
          <p className="page_counter_currentPage">{currentPage}</p>
          {nextUrl ? (
            <>
              <p className="page_counter_other_pages">{currentPage + 1}</p>
              <button onClick={onNextPage}>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default PokemonList;
