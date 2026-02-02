import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { MovieModal } from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { useEffect, useState } from "react";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import toast, { Toaster } from "react-hot-toast";

import "./App.module.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Error Message
  const [isError, setIsError] = useState(false);

  // isNoMovies

  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    if (isSearched === true && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSearched, movies]);

  // One Movie Object
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleModal = (movie: Movie) => {
    openModal();
    setSelectedMovie(movie);
  };
  const handleSearch = async (query: string) => {
    try {
      setIsSearched(false);
      setMovies([]);
      setIsLoading(true);
      setIsError(false);

      const data = await fetchMovies(query);
      setMovies(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsSearched(true);
    }
  };
  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster />
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleModal} />
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}
