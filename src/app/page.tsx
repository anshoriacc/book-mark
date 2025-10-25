import { BookRandomCarousel } from "@/components/book-random-carousel";
import { SearchBooks } from "@/components/search-books";

export default async function HomePage() {
  return (
    <main className="space-y-2">
      <SearchBooks />
      <BookRandomCarousel />
    </main>
  );
}
