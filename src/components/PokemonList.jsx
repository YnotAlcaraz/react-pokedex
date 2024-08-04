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

  //? Se obtiene el listado inicial de pokemons junto con la informacion detallada de cada uno
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setIsLoading(true);
        const pokemonResponse = await getPokemonPage(currentPageOffset.current);
        //? Se almacena el numero de pokemones totales para usarlo en el PageCounter
        maxItems.current = pokemonResponse.count;
        //? Se obtiene la información de los pokemones y se guardan en un nuevo array
        const pokeArray = await Promise.all(
          pokemonResponse.results.map(async (pokemon) => {
            const { data: pokemonDetails } = await getPokemon(pokemon.name);
            const { color: pokemonSpecies } = await getSpecies(
              pokemonDetails.species.url
            );

            return {
              base_experience: pokemonDetails.base_experience,
              height: pokemonDetails.height,
              name: pokemon.name,
              species_color: pokemonSpecies.name,
              sprites: pokemonDetails.sprites,
              stats: pokemonDetails.stats,
              types: pokemonDetails.types,
              weight: pokemonDetails.weight,
            };
          })
        );

        //? Se asigna el valor del array creado a los estados
        setPokemonList(pokeArray);
        setFilteredPokemonList(pokeArray);
        setStoredPokemonList(pokeArray);
      } catch (err) {
        setPokemonList([]);
        setFilteredPokemonList([]);
        setStoredPokemonList([]);
      }
      setIsLoading(false);
    };

    fetchPokemons();
  }, []);

  //? Se busca un pokemon basado en el searchValue ingresado en el input de busqueda
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setIsLoading(true);
        const pokemonResponse = await getPokemon(searchValue);
        //? Si no se encontró un pokemon, se vacía filteredPokemon list para mostrar NotFound, se settea isLoading a false y se retorna para no continuar;
        if (!pokemonResponse) {
          setFilteredPokemonList([]);
          setIsLoading(false);
          return;
        }
        //? Se obtiene la información del pokemon, se crea un nuevo objeto con ella y se guarda en filteredPokemonList para renderizarlo en pantalla
        const { data: pokemonDetails } = await getPokemon(
          pokemonResponse.data.name
        );
        const { color: pokemonSpecies } = await getSpecies(
          pokemonDetails.species.url
        );
        const pokemonData = {
          base_experience: pokemonDetails.base_experience,
          height: pokemonDetails.height,
          name: pokemonResponse.data.name,
          species_color: pokemonSpecies.name,
          sprites: pokemonDetails.sprites,
          stats: pokemonDetails.stats,
          types: pokemonDetails.types,
          weight: pokemonDetails.weight,
        };

        setFilteredPokemonList([pokemonData]);
      } catch (err) {
        setFilteredPokemonList([]);
      }
      setIsLoading(false);
    };

    //? Si searchValue contiene información, se ejecuta la función de búsqueda
    if (searchValue.trim().length > 0) {
      fetchPokemon();
    } else {
      //? Si searchValue está vacío, se asigna el valor de pokemonList a filteredList
      setFilteredPokemonList(pokemonList);
      setIsLoading(false);
    }
  }, [searchValue]);

  //? Al retroceder a la página anterior se hace siempre desde memoria
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

  //? Se envía al usuario a la primera página, se limpian el valor del input y searchValue
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

  //? Se envía al usuario a la siguiente página
  const onNextPage = async () => {
    setIsLoading(true);
    //? Se valida si los siguientes elementos ya se encuentran en memoria, si lo están, se toman desde ahí
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
      //? Si no están en memoria, se hace un get a la API y se almacenan en memoria para su futuro uso
      try {
        currentPageOffset.current += 1;
        const pokemonResponse = await getPokemonPage(currentPageOffset.current);
        //? Se obtiene la información de los pokemones y se guardan en un nuevo array
        const pokeArray = await Promise.all(
          pokemonResponse.results.map(async (pokemon) => {
            const { data: pokemonDetails } = await getPokemon(pokemon.name);
            const { color: pokemonSpecies } = await getSpecies(
              pokemonDetails.species.url
            );
            return {
              base_experience: pokemonDetails.base_experience,
              height: pokemonDetails.height,
              name: pokemon.name,
              species_color: pokemonSpecies.name,
              sprites: pokemonDetails.sprites,
              stats: pokemonDetails.stats,
              types: pokemonDetails.types,
              weight: pokemonDetails.weight,
            };
          })
        );

        //? Se asigna el valor del array creado a los estados
        setStoredPokemonList([...storedPokemonList, ...pokeArray]);
        setCurrentPage(currentPage + 1);
        setPokemonList(pokeArray);
        setFilteredPokemonList(pokeArray);
      } catch (err) {
        //? En caso de error, se manda al usuario a la primera página
        sendToFirstPage();
      }
    }
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
