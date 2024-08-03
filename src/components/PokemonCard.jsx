import { useEffect, useState } from "react";
import { getPokemon } from "../services/pokemonServices";
import { formatDecimeters, formatHectograms } from "../utils/formatter";

const PokemonCard = ({ pokemonName, pokemonImageUrl }) => {
  const [pokemonInfo, setPokemonInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoading(true);
      try {
        const pokemonResponse = await getPokemon(pokemonName);
        setPokemonInfo(pokemonResponse.data);
      } catch (error) {
        console.error("Failed to fetch Pokémon details:", error);
      }
      setIsLoading(false);
    };
    fetchPokemon();
  }, [pokemonName]);

  return (
    <div
      className={!isLoading ? "pokemon_card" : "pokemon_card_center_content"}
    >
      {isLoading ? (
        <img
          src="src/assets/images/pokemon_logo.png"
          className="pokemon_card_loading"
          alt="Loading"
        />
      ) : (
        <div>
          <p>{pokemonName}</p>
          <div className="pokemon_card_top">
            <img
              src={pokemonInfo?.sprites?.front_default}
              className="pokemon_card_sprite"
              alt={pokemonName}
            />
          </div>
          {pokemonInfo?.types?.map((type, index) => {
            return <p key={index}>{type.type.name}</p>;
          })}
          <p>XP {pokemonInfo.base_experience}</p>
          <div className="weight_height_row">
            <p>Weight: {formatHectograms(pokemonInfo.weight)}</p>
            <p>Height: {formatDecimeters(pokemonInfo.height)}</p>
          </div>
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
      )}
    </div>
  );
};

export default PokemonCard;
