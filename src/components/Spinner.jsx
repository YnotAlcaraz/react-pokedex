import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Spinner = () => {
  return (
    <div className="spinner">
      <FontAwesomeIcon icon={faSpinner} spinPulse />
      <p>Cargando...</p>
    </div>
  );
};

export default Spinner;
