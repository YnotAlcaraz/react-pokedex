import axios from "axios";

const host = import.meta.env.VITE_HOST;

export const getPokemons = async () => {
  try {
    const response = await axios.get(`${host}pokemon/`);
    return response.data;
  } catch (err) {
    console.log(`Error al obtener la lista de Pokemons \n${err}`);
    return [];
  }
};

export const getPokemonPage = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(`Error al obtener la lista de Pokemons de ${url} \n${err}`);
    return [];
  }
};

export const getPokemon = async (id) => {
  try {
    const response = await axios.get(`${host}pokemon/${id}`);
    return response;
  } catch (err) {
    console.log(`Error al obtener el Pokemon ${id} \n${err}`);
    return null;
  }
};
