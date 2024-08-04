import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PageCounter = ({
  currentPage,
  onPreviousPage,
  onNextPage,
  maxPages,
  sendToFirstPage,
}) => {
  return (
    <div className="page_counter">
      <div className="page_counter_child">
        {currentPage > 1 ? (
          <>
            <button onClick={onPreviousPage}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <p className="page_counter_other_pages">{currentPage - 1}</p>
          </>
        ) : null}
        <p className="page_counter_currentPage">{currentPage}</p>
        {maxPages > currentPage ? (
          <>
            <p className="page_counter_other_pages">{currentPage + 1}</p>
            <button onClick={onNextPage}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </>
        ) : null}
      </div>
      {currentPage > 1 && (
        <p onClick={sendToFirstPage} className="text_button">
          Volver al inicio
        </p>
      )}
    </div>
  );
};

export default PageCounter;
