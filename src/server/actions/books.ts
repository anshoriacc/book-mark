"use server";

import { TGetBookListParams, TGetBookListResponse, TBookVolume } from "./type";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1";

export const getBookList = async ({
  query,
  startIndex = 0,
  maxResults = 10,
  download,
  filter,
  langRestrict,
  libraryRestrict,
  orderBy,
  partner,
  printType,
  projection,
  showPreorders,
  source,
}: TGetBookListParams) => {
  if (!query || query.trim().length === 0) {
    throw new Error("Search query is required");
  }
  try {
    const searchParams = new URLSearchParams({
      q: query,
      startIndex: startIndex.toString(),
      maxResults: maxResults.toString(),
    });

    if (download) searchParams.append("download", download);
    if (filter) searchParams.append("filter", filter);
    if (langRestrict) searchParams.append("langRestrict", langRestrict);
    if (libraryRestrict)
      searchParams.append("libraryRestrict", libraryRestrict);
    if (orderBy) searchParams.append("orderBy", orderBy);
    if (partner) searchParams.append("partner", partner);
    if (printType) searchParams.append("printType", printType);
    if (projection) searchParams.append("projection", projection);
    if (showPreorders !== undefined)
      searchParams.append("showPreorders", showPreorders.toString());
    if (source) searchParams.append("source", source);

    const response = await fetch(
      `${GOOGLE_BOOKS_API}/volumes?${searchParams.toString()}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as TGetBookListResponse;
  } catch (error) {
    console.error("Search books error:", error);
    throw error;
  }
};

export const getBookDetails = async (volumeId: string) => {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}/volumes/${volumeId}`);

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as TBookVolume;
  } catch (error) {
    console.error("Get book details error:", error);
    throw error;
  }
};
