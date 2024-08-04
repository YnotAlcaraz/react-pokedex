import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PageCounter = ({ currentPage, onPreviousPage, onNextPage, nextUrl }) => {
  return (
    <div>
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
      {currentPage > 1 ? (
        <p>Volver al inicio</p>
      ) : (
        //TODO
        <p style={{ color: "white" }}> . </p>
      )}
    </div>
  );
};

export default PageCounter;
