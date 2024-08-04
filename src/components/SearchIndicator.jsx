const SearchIndicator = ({ searchValue, sendToFirstPage }) => {
  return (
    <div className="page_counter">
      <p className="regular_bold_text">Resultados de {searchValue}</p>
      <p className="text_button" onClick={sendToFirstPage}>
        Volver al inicio
      </p>
    </div>
  );
};

export default SearchIndicator;
