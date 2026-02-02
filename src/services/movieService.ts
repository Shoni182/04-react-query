// import axio
import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
  results: Movie[];
}
// API key
const myKey = import.meta.env.VITE_API_KEY;

// fetch function
export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    },
  );
  return response.data.results;
};
