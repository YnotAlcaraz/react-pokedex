//? Convierte decímetros a metros o centimetros
export const formatDecimeters = (height) => {
  try {
    const formattedHeight = height / 10;
    if (formattedHeight < 1) {
      return `${height * 10} cm`;
    }
    return `${formattedHeight} m`;
  } catch (err) {
    return "Unavailable";
  }
};

//? Convierte hectogramos a kilogramos
export const formatHectograms = (weight) => {
  try {
    const weightInKilos = weight / 10;
    return `${weightInKilos} kg`;
  } catch (err) {
    return "Unavailable";
  }
};
