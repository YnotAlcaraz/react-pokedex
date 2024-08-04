const NotFound = ({ sendToFirstPage }) => {
  return (
    <div className="not_found">
      <img src="src/assets/images/psyduck.png" />
      <p className="not_found_title">¡No se encontraron resultados!</p>
      <p className="not_found_subtitle">
        Verifica que hayas escrito el nombre correctamente
      </p>

      <p className="text_button" onClick={sendToFirstPage}>
        Volver al inicio
      </p>
    </div>
  );
};

export default NotFound;
