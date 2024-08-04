import { useContext, useRef } from "react";
import { context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [searchValue, setSearchValue] = useContext(context);
  //? Se crea una variable para no actualizar el estado en cada onChange
  let stringValue = useRef("");

  const handleInputChange = ({ target: input }) => {
    stringValue.current = input.value;
    if (stringValue.current.length === 0) {
      setSearchValue(stringValue.current);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchValue(stringValue.current);
      event.preventDefault();
    }
  };

  const onPressSearchButton = () => {
    setSearchValue(stringValue.current);
  };

  return (
    <nav className="header">
      <div className="logo_container">
        <img src="src/assets/images/pokemon_logo.png" alt="Pokemon Logo" />
      </div>
      <div className="search_container">
        <input
          type="search"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ingresa el nombre del Pokemon"
          className="search_input"
          id="search_input"
        />
        <button onClick={onPressSearchButton}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </nav>
  );
};

export default Header;
