import { SearchBooks } from "@/components/search-books";

export default async function HomePage() {
  return (
    <main className="space-y-2">
      <SearchBooks />
    </main>
  );
}
