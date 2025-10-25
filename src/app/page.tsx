import { SearchBooks } from "@/components/search-books";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <main className="space-y-2">
      <Suspense>
        <SearchBooks />
      </Suspense>
    </main>
  );
}
