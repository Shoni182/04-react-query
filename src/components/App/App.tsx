import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { MovieModal } from "../MovieModal/MovieModal";
import { type Movie } from "../../types/movie";
import { useState } from "react";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import { toast, Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useEffect } from "react";

import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function App() {
  //: query state
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // One Movie Object
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleModal = (movie: Movie) => {
    openModal();
    setSelectedMovie(movie);
  };

  //: Refactor response
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    // щоб запустити функцію запиту
    queryFn: () => fetchMovies(query, currentPage),
    // щоб ну було лишнього запиту
    enabled: query !== "",
    // щоб зберегти попередні виведені данні
    placeholderData: keepPreviousData,
  });
  //
  const totalPages = data?.total_pages || 0;

  //: Search
  const handleSearch = (query: string) => {
    setQuery(query);
  };

  useEffect(() => {
    if (isSuccess === true && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data?.results && (
        <MovieGrid movies={data?.results} onSelect={handleModal} />
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </>
  );
}
