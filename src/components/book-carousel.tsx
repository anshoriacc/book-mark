"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, SearchIcon } from "lucide-react";

import { useGetBookListQuery } from "@/hooks/api/books";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./ui/empty";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { Book } from "./book";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useQueryState } from "nuqs";

type Props = {
  subject: string;
  title?: string;
};

export const BookCarousel = ({ subject, title }: Props) => {
  const [_, setQuery] = useQueryState("query", {
    defaultValue: "",
    history: "replace",
  });

  const bookListQuery = useGetBookListQuery({
    query: `subject:${subject}`,
  });

  const bookList = bookListQuery.data?.items || [];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold capitalize">{title ?? subject}</h3>

        <Button
          onClick={() => setQuery(`subject:${subject}`)}
          variant="link"
          size="sm">
          View All
        </Button>
      </div>

      <div>
        <AnimatePresence>
          {bookListQuery.isError && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}>
              <div className="pb-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to load books. Please try again later.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Carousel className="w-full max-w-sm sm:max-w-xl md:max-w-248 select-none mx-auto">
          <CarouselContent className="rounded-xl">
            {bookListQuery.isLoading ? (
              [...Array(10)].map((_, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                  <CardPlaceholder />
                </CarouselItem>
              ))
            ) : bookList.length > 0 ? (
              bookList.map(book => (
                <CarouselItem
                  key={book.id}
                  className="sm:basis-1/2 lg:basis-1/3">
                  <Book data={book} />
                </CarouselItem>
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <SearchIcon className="text-muted-foreground h-12 w-12" />
                  <EmptyTitle>No books found</EmptyTitle>
                  <EmptyDescription>
                    We couldn&apos;t find any books in this category. Try
                    searching for something else.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CarouselContent>

          <div className="relative mt-2 flex justify-end gap-2">
            <CarouselPrevious className="static translate-0" />
            <CarouselNext className="static translate-0" />
          </div>
        </Carousel>
      </div>
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
