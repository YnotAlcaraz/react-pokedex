import { useEffect, useState } from "react";
import { getPokemon } from "../services/pokemonServices";
import { formatDecimeters, formatHectograms } from "../utils/formatter";
import { PokemonSpeciesColor, PokemonTypeColors } from "../utils/constants";
import PokemonCardLoading from "./PokemonCardLoading";
import { getSpecies } from "../services/speciesServices";

const PokemonCard = ({ pokemonName, pokemonImageUrl }) => {
  const [pokemonInfo, setPokemonInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [borderColor, setBorderColor] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setIsLoading(true);
        const pokemonResponse = await getPokemon(pokemonName);
        setPokemonInfo(pokemonResponse.data);
        const speciesResponse = await getSpecies(
          pokemonResponse.data.species.url
        );
        setBackgroundColor(PokemonSpeciesColor[speciesResponse.color.name]);
        setBorderColor(
          PokemonSpeciesColor[`${speciesResponse.color.name}Border`]
        );
        setIsLoading(false);
      } catch (err) {
        //? En caso de error no se hace un setIsLoading(false) y se deja la tarjeta mostrando la parte de atrás
        console.log(`Error al cargar la tarjeta de ${pokemonName} \n${err}`);
      }
    };
    fetchPokemon();
  }, [pokemonName]);

  return isLoading ? (
    <PokemonCardLoading />
  ) : (
    <div
      className="pokemon_card"
      style={{
        backgroundColor: backgroundColor,
        border: `2px solid ${borderColor}`,
      }}
    >
      <div>
        <div
          className="pokemon_card_top"
          style={{
            border: `2px solid ${borderColor}`,
          }}
        >
          <img
            src={pokemonInfo?.sprites?.front_default}
            className="pokemon_card_sprite"
            alt={pokemonName}
          />
        </div>
        <div className="pokemon_card_row">
          <p className="pokemon_card_name">{pokemonName}</p>
          <p className="pokemon_card_xp">XP {pokemonInfo.base_experience}</p>
        </div>
      </div>

      <div className="pokemon_types_container">
        {pokemonInfo?.types?.map((type, index) => {
          const typeColor = PokemonTypeColors[type.type.name] || "#000";
          const typeBorder =
            PokemonTypeColors[`${type.type.name}Border` || "#FFFFF"];
          return (
            <div
              className="pokemon_type"
              key={index}
              style={{
                backgroundColor: typeColor,
                border: `2px solid ${typeBorder}`,
                color: typeBorder,
              }}
            >
              {type.type.name}
            </div>
          );
        })}
      </div>
      <div className="pokemon_info_container">
        <div className="weight_height_row">
          <p>Weight: {formatHectograms(pokemonInfo.weight)}</p>
          <p>Height: {formatDecimeters(pokemonInfo.height)}</p>
        </div>
        <div className="pokemon_stat_container">
          {pokemonInfo?.stats?.map((stat, index) => {
            return (
              <div className="pokemon_card_stat_row" key={index}>
                <p className="pokemon_card_stat_name">{stat.stat.name}</p>
                <progress max={100} value={stat.base_stat} />
                <p className="pokemon_card_stat_number">{stat.base_stat}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
