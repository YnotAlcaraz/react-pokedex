import { useEffect, useState } from "react";
import { formatDecimeters, formatHectograms } from "../utils/formatter";
import { PokemonSpeciesColor, PokemonTypeColors } from "../utils/constants";

const PokemonCard = ({ pokemonData }) => {
  const [backgroundColor, setBackgroundColor] = useState("");
  const [borderColor, setBorderColor] = useState("");

  useEffect(() => {
    //? Se toman los colores de los pokemon y se buscan en PokemonSpeciesColor para utilizarlos en la tarjeta
    setBackgroundColor(PokemonSpeciesColor[pokemonData.species_color]);
    setBorderColor(PokemonSpeciesColor[`${pokemonData.species_color}Border`]);
  }, [pokemonData]);

  return (
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
            src={pokemonData?.sprites?.front_default}
            className="pokemon_card_sprite"
          />
        </div>
        <div className="pokemon_card_row">
          <p className="pokemon_card_name">{pokemonData.name}</p>
          <p className="pokemon_card_xp">XP {pokemonData.base_experience}</p>
        </div>
      </div>

      <div className="pokemon_types_container">
        {pokemonData?.types?.map((type, index) => {
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
          <p>Weight: {formatHectograms(pokemonData.weight)}</p>
          <p>Height: {formatDecimeters(pokemonData.height)}</p>
        </div>
        <div className="pokemon_stat_container">
          {pokemonData?.stats?.map((stat, index) => {
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
