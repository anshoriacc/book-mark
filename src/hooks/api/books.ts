import { getBookList } from "@/server/actions/books";
import {
  TGetBookListParams,
  TGetBookListResponse,
} from "@/server/actions/type";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export function useGetBookListQuery(params: TGetBookListParams) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: async () => getBookList(params),
    enabled: params.query.trim().length > 1,
  });
}

export function useGetBookListInfiniteQuery(
  params: Omit<TGetBookListParams, "startIndex">,
) {
  return useInfiniteQuery({
    queryKey: ["books-infinite", params],
    queryFn: async ({ pageParam = 0 }) =>
      getBookList({ ...params, startIndex: pageParam }),
    getNextPageParam: (lastPage: TGetBookListResponse, allPages) => {
      const currentIndex = (allPages.length - 1) * (params.maxResults || 10);
      const totalItems = lastPage.totalItems;
      const nextIndex = currentIndex + (params.maxResults || 10);

      return nextIndex < totalItems ? nextIndex : undefined;
    },
    initialPageParam: 0,
    enabled: params.query.trim().length > 1,
  });
}
