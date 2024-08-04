import { useEffect, useRef, useState } from "react";
import {
  getPokemon,
  getPokemonPage,
  getPokemons,
} from "../services/pokemonServices";
import PokemonCard from "./PokemonCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import PageCounter from "./PageCounter";

const PokemonList = ({ searchValue }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousUrl, setPreviousUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);

  let currentPageOffset = useRef(0);

  //TODO: Buscador, diseño, guardar data en caché

  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true);
      const pokemonResponse = await getPokemonPage(currentPageOffset.current);
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
    currentPageOffset.current -= 1;
    const pokemonResponse = await getPokemonPage(currentPageOffset.current);
    setCurrentPage(currentPage - 1);
    setPokemonList(pokemonResponse.results);
    setFilteredPokemonList(pokemonResponse.results);
    setIsLoading(false);
  };

  const onNextPage = async () => {
    setIsLoading(true);
    currentPageOffset.current += 1;
    const pokemonResponse = await getPokemonPage(currentPageOffset.current);
    setCurrentPage(currentPage + 1);
    setPokemonList(pokemonResponse.results);
    setFilteredPokemonList(pokemonResponse.results);
    setIsLoading(false);
  };

  const sendToFirstPage = async () => {
    setIsLoading(true);
    currentPageOffset.current = 0;
    const pokemonResponse = await getPokemonPage(currentPageOffset.current);
    setCurrentPage(1);
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
          sendToFirstPage={sendToFirstPage}
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
    </>
  );
};

export default PokemonList;
