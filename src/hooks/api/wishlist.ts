import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAnonWishlistWithItems,
  addToAnonWishlist,
  deleteWishlistItem,
  updateWishlistItem,
  checkWishlistItemExists,
  restoreWishlistItem,
} from "@/server/actions/wishlist";
import type { Wishlist, WishlistItem, Prisma } from "@prisma/client";

export const WISHLIST_QUERY_KEYS = {
  all: ["wishlist"] as const,
  anonWishlist: () => [...WISHLIST_QUERY_KEYS.all, "anon"] as const,
  anonItems: () => [...WISHLIST_QUERY_KEYS.all, "anon", "items"] as const,
  itemExists: (volumeId: string) =>
    [...WISHLIST_QUERY_KEYS.all, "exists", volumeId] as const,
};

export function useGetAnonWishlistQuery(): UseQueryResult<
  Wishlist & {
    items: WishlistItem[];
  }
> {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEYS.anonWishlist(),
    queryFn: () => getAnonWishlistWithItems(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAddToWishlistMutation(): UseMutationResult<
  WishlistItem,
  Error,
  {
    volumeId: string;
    title: string;
    data?: Partial<
      Omit<Prisma.WishlistItemCreateInput, "wishlist" | "volumeId" | "title">
    >;
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ volumeId, title, data }) =>
      addToAnonWishlist(volumeId, title, data),
    onSuccess: () => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({
        queryKey: WISHLIST_QUERY_KEYS.anonWishlist(),
      });
    },
    onError: error => {
      console.error("Add to wishlist error:", error);
    },
  });
}

export function useDeleteWishlistItemMutation(): UseMutationResult<
  WishlistItem,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteWishlistItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WISHLIST_QUERY_KEYS.anonWishlist(),
      });
    },
    onError: error => {
      console.error("Delete wishlist item error:", error);
    },
  });
}

export function useUpdateWishlistItemMutation(): UseMutationResult<
  WishlistItem,
  Error,
  {
    itemId: string;
    data: Prisma.WishlistItemUpdateInput;
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }) => updateWishlistItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WISHLIST_QUERY_KEYS.anonWishlist(),
      });
    },
    onError: error => {
      console.error("Update wishlist item error:", error);
    },
  });
}

export function useRestoreWishlistItemMutation(): UseMutationResult<
  WishlistItem,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => restoreWishlistItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WISHLIST_QUERY_KEYS.anonWishlist(),
      });
    },
    onError: error => {
      console.error("Restore wishlist item error:", error);
    },
  });
}

export function useCheckWishlistItemExists(
  volumeId: string,
): UseQueryResult<boolean> {
  const { data: wishlist } = useGetAnonWishlistQuery();

  return useQuery({
    queryKey: WISHLIST_QUERY_KEYS.itemExists(volumeId),
    queryFn: async () => {
      if (!wishlist) return false;
      return checkWishlistItemExists(wishlist.id, volumeId);
    },
    enabled: !!wishlist,
    staleTime: 1000 * 60,
  });
}
