"use client";

import { useQueryState } from "nuqs";

import { SearchBox } from "./search-box";
import { BookRandomCarousel } from "./book-random-carousel";
import { BookList } from "./book-list";

export const SearchBooks = () => {
  const [query] = useQueryState("query", {
    defaultValue: "",
    history: "replace",
  });

  return (
    <section className="grid gap-8">
      <SearchBox />
      {query ? <BookList /> : <BookRandomCarousel />}
    </section>
  );
};
