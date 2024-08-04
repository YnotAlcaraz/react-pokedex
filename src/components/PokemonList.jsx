import { useContext, useEffect, useRef, useState } from "react";
import { getPokemon, getPokemonPage } from "../services/pokemonServices";
import PokemonCard from "./PokemonCard";
import Spinner from "./Spinner";
import PageCounter from "./PageCounter";
import { getSpecies } from "../services/speciesServices";
import { context } from "../App";
import NotFound from "./NotFound";
import SearchIndicator from "./SearchIndicator";

const PokemonList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [storedPokemonList, setStoredPokemonList] = useState([]);

  const [searchValue, setSearchValue] = useContext(context);

  let currentPageOffset = useRef(0);
  let maxItems = useRef(0);

  useEffect(() => {
    const fetchPokemons = async () => {
      setIsLoading(true);
      const pokemonResponse = await getPokemonPage(currentPageOffset.current);
      maxItems.current = pokemonResponse.count;
      const pokeArray = await Promise.all(
        pokemonResponse.results.map(async (pokemon) => {
          const pokemonDetails = await getPokemon(pokemon.name);
          const pokemonSpecies = await getSpecies(
            pokemonDetails.data.species.url
          );
          return {
            ...pokemon,
            ...pokemonDetails.data,
            species_color: pokemonSpecies.color.name,
          };
        })
      );
      setPokemonList(pokeArray);
      setFilteredPokemonList(pokeArray);
      setStoredPokemonList(pokeArray);
      setIsLoading(false);
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoading(true);
      const pokemonResponse = await getPokemon(searchValue);
      if (!pokemonResponse) {
        setFilteredPokemonList([]);
        setIsLoading(false);
        return;
      }
      const { data: pokemonDetails } = await getPokemon(
        pokemonResponse.data.name
      );
      const { color: pokemonSpecies } = await getSpecies(
        pokemonDetails.species.url
      );
      const pokemonData = {
        ...pokemonResponse.data,
        ...pokemonDetails,
        species_color: pokemonSpecies.name,
      };

      pokemonData
        ? setFilteredPokemonList([pokemonData])
        : setFilteredPokemonList([]);
      setIsLoading(false);
    };
    if (searchValue.length > 0) {
      fetchPokemon();
    } else {
      setFilteredPokemonList(pokemonList);
      setIsLoading(false);
    }
  }, [searchValue]);

  const onPreviousPage = async () => {
    setIsLoading(true);
    const previousIndex = (currentPageOffset.current - 1) * 20;
    const slicedPokemonList = storedPokemonList.slice(
      previousIndex,
      previousIndex + 20
    );

    currentPageOffset.current -= 1;
    setCurrentPage(currentPage - 1);
    setPokemonList(slicedPokemonList);
    setFilteredPokemonList(slicedPokemonList);
    setIsLoading(false);
  };

  const onNextPage = async () => {
    setIsLoading(true);
    if ((currentPageOffset.current + 1) * 20 < storedPokemonList.length) {
      const nextIndex = (currentPageOffset.current + 1) * 20;
      const slicedPokemonList = storedPokemonList.slice(
        nextIndex,
        nextIndex + 20
      );

      currentPageOffset.current += 1;
      setCurrentPage(currentPage + 1);
      setPokemonList(slicedPokemonList);
      setFilteredPokemonList(slicedPokemonList);
    } else {
      currentPageOffset.current += 1;
      const pokemonResponse = await getPokemonPage(currentPageOffset.current);
      const pokeArray = await Promise.all(
        pokemonResponse.results.map(async (pokemon) => {
          const pokemonDetails = await getPokemon(pokemon.name);
          const pokemonSpecies = await getSpecies(
            pokemonDetails.data.species.url
          );
          return {
            ...pokemon,
            ...pokemonDetails.data,
            species_color: pokemonSpecies.color.name,
          };
        })
      );

      setStoredPokemonList([...storedPokemonList, ...pokeArray]);

      setCurrentPage(currentPage + 1);
      setPokemonList(pokeArray);
      setFilteredPokemonList(pokeArray);
    }
    setIsLoading(false);
  };

  const sendToFirstPage = async () => {
    const searchInput = document.getElementById("search_input");
    searchInput.value = "";
    setSearchValue("");
    setIsLoading(true);
    currentPageOffset.current = 0;
    const slicedPokemonList = storedPokemonList.slice(0, 20);
    setCurrentPage(1);
    setPokemonList(slicedPokemonList);
    setFilteredPokemonList(slicedPokemonList);
    setIsLoading(false);
  };

  return (
    <>
      {searchValue?.trim()?.length > 0 ? (
        <SearchIndicator
          searchValue={searchValue}
          sendToFirstPage={sendToFirstPage}
        />
      ) : (
        <PageCounter
          currentPage={currentPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          maxPages={Math.ceil(maxItems.current / 20)}
          sendToFirstPage={sendToFirstPage}
        />
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="pokemon_list">
          {filteredPokemonList.length > 0 ? (
            filteredPokemonList?.map((pokemon, index) => {
              return <PokemonCard key={index} pokemonData={pokemon} />;
            })
          ) : (
            <NotFound sendToFirstPage={sendToFirstPage} />
          )}
        </div>
      )}
    </>
  );
};

export default PokemonList;
