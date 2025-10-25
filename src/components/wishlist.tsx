"use client";

import { Book } from "./book";
import { useGetAnonWishlistQuery } from "@/hooks/api/wishlist";
import { TBookVolume } from "@/server/actions/type";

export const Wishlist = () => {
  const wishlistQuery = useGetAnonWishlistQuery();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Book List</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistQuery.data?.items.map(book => (
          <Book key={book.id} data={book.rawData as TBookVolume} />
        ))}
      </div>
    </div>
  );
};
