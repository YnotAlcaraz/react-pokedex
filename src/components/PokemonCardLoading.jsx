const PokemonCardLoading = () => {
  return (
    <div className="pokemon_card_center_content">
      <div className="pokemon_card_logo_container">
        <img
          src="src/assets/images/pokemon_logo.png"
          className="pokemon_card_loading"
          alt="Loading"
        />
        <img
          src="src/assets/images/pokemon_logo.png"
          className="pokemon_card_loading"
          alt="Loading"
          style={{ transform: "rotate(180deg)" }}
        />
      </div>
    </div>
  );
};

export default PokemonCardLoading;
