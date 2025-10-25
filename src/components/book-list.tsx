"use client";

import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";

import { useGetBookListInfiniteQuery } from "@/hooks/api/books";
import { Book } from "./book";
import { Skeleton } from "./ui/skeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { Card } from "./ui/card";

export const BookList = () => {
  const [query] = useQueryState("query", {
    defaultValue: "",
    history: "replace",
  });

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetBookListInfiniteQuery({
      query: debouncedQuery,
    });

  const books = data?.pages.flatMap(page => page.items || []) || [];
  const isEmpty = !isLoading && books.length === 0;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Book List</h2>

      {isEmpty ? (
        <Empty>
          <EmptyHeader>
            <SearchIcon className="text-muted-foreground h-12 w-12" />
            <EmptyTitle>No books found</EmptyTitle>
            <EmptyDescription>
              Try searching for a different query or browse our categories.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map(book => (
              <Book key={book.id} data={book} />
            ))}
            {isLoading &&
              [...Array(6)].map((_, i) => (
                <CardPlaceholder key={`loading-${i}`} />
              ))}
            {isFetchingNextPage &&
              [...Array(3)].map((_, i) => (
                <CardPlaceholder key={`loading-next-${i}`} />
              ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline">
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CardPlaceholder = () => {
  return (
    <Card className="grid aspect-3/2 grid-cols-[auto_1fr] gap-2 overflow-hidden p-2 text-sm">
      {/* Image Skeleton */}
      <Skeleton className="aspect-2/3 h-full max-h-54 w-fit rounded-sm" />

      <div className="flex flex-col gap-1">
        {/* Title and Meta Skeleton */}
        <div>
          <Skeleton className="mb-2 h-5 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>

        {/* Description Skeleton */}
        <div className="rounded-sm border p-1">
          <Skeleton className="mb-1 h-3 w-1/5 rounded" />
          <Skeleton className="mb-1 h-3 w-full rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
        </div>

        {/* Rating Skeleton */}
        <div className="mt-auto flex items-center justify-end gap-1">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-8 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      </div>
    </Card>
  );
};
