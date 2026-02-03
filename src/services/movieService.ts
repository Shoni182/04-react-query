// import axio
import axios from "axios";
import { type Movie } from "../types/movie";

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

const myKey = import.meta.env.VITE_API_KEY;

// fetch function
export const fetchMovies = async (query: string, page: number) => {
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    },
  );
  return response.data;
};
