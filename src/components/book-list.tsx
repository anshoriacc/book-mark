"use client";

import { useGetBookListQuery } from "@/hooks/api/books";
import { Book } from "./book";

export const BookList = () => {
  const bookListQuery = useGetBookListQuery({
    query: "subject:programming",
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Book List</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookListQuery.data?.items.map(book => (
          <Book key={book.id} data={book} />
        ))}
      </div>
    </div>
  );
};
