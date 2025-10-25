"use server";

import prisma from "@/lib/prisma";
import { getOrCreateAnon } from "@/lib/anon";
import type { Wishlist, WishlistItem, Prisma } from "@prisma/client";

export const getOrCreateAnonUser = async (): Promise<string> => {
  const { profileId } = await getOrCreateAnon();
  return profileId;
};

export const createWishlist = async (
  profileId: string,
  name: string = "My Wishlist",
): Promise<Wishlist> => {
  try {
    const wishlist = await prisma.wishlist.create({
      data: {
        profileId,
        name,
      },
    });
    return wishlist;
  } catch (error) {
    console.error("Create wishlist error:", error);
    throw error;
  }
};

export const getWishlistWithItems = async (
  wishlistId: string,
): Promise<
  Wishlist & {
    items: WishlistItem[];
  }
> => {
  try {
    const wishlist = await prisma.wishlist.findUniqueOrThrow({
      where: {
        id: wishlistId,
      },
      include: {
        items: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return wishlist;
  } catch (error) {
    console.error("Get wishlist with items error:", error);
    throw error;
  }
};

export const updateWishlist = async (
  wishlistId: string,
  data: Prisma.WishlistUpdateInput,
): Promise<Wishlist> => {
  try {
    const wishlist = await prisma.wishlist.update({
      where: {
        id: wishlistId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return wishlist;
  } catch (error) {
    console.error("Update wishlist error:", error);
    throw error;
  }
};

export const deleteWishlist = async (wishlistId: string): Promise<Wishlist> => {
  try {
    const wishlist = await prisma.wishlist.update({
      where: {
        id: wishlistId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return wishlist;
  } catch (error) {
    console.error("Delete wishlist error:", error);
    throw error;
  }
};

export const addWishlistItem = async (
  wishlistId: string,
  volumeId: string,
  title: string,
  data?: Partial<
    Omit<Prisma.WishlistItemCreateInput, "wishlist" | "volumeId" | "title">
  >,
): Promise<WishlistItem> => {
  try {
    // Check if item exists but is deleted
    const deletedItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId,
        volumeId,
        deletedAt: { not: null },
      },
    });

    // If deleted item exists, restore it
    if (deletedItem) {
      return await prisma.wishlistItem.update({
        where: { id: deletedItem.id },
        data: {
          deletedAt: null,
          ...data,
        },
      });
    }

    // Otherwise create new item
    const item = await prisma.wishlistItem.create({
      data: {
        wishlistId,
        volumeId,
        title,
        rawData: data?.rawData || {},
        ...data,
      },
    });
    return item;
  } catch (error) {
    console.error("Add wishlist item error:", error);
    throw error;
  }
};

export const getWishlistItems = async (
  wishlistId: string,
): Promise<WishlistItem[]> => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: {
        wishlistId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return items;
  } catch (error) {
    console.error("Get wishlist items error:", error);
    throw error;
  }
};

export const getWishlistItem = async (
  itemId: string,
): Promise<WishlistItem> => {
  try {
    const item = await prisma.wishlistItem.findUniqueOrThrow({
      where: {
        id: itemId,
      },
    });
    return item;
  } catch (error) {
    console.error("Get wishlist item error:", error);
    throw error;
  }
};

export const updateWishlistItem = async (
  itemId: string,
  data: Prisma.WishlistItemUpdateInput,
): Promise<WishlistItem> => {
  try {
    const item = await prisma.wishlistItem.update({
      where: {
        id: itemId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return item;
  } catch (error) {
    console.error("Update wishlist item error:", error);
    throw error;
  }
};

export const deleteWishlistItem = async (
  itemId: string,
): Promise<WishlistItem> => {
  try {
    const item = await prisma.wishlistItem.update({
      where: {
        id: itemId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return item;
  } catch (error) {
    console.error("Delete wishlist item error:", error);
    throw error;
  }
};

export const restoreWishlistItem = async (
  itemId: string,
): Promise<WishlistItem> => {
  try {
    const item = await prisma.wishlistItem.update({
      where: {
        id: itemId,
      },
      data: {
        deletedAt: null,
      },
    });
    return item;
  } catch (error) {
    console.error("Restore wishlist item error:", error);
    throw error;
  }
};

export const checkWishlistItemExists = async (
  wishlistId: string,
  volumeId: string,
): Promise<boolean> => {
  try {
    const item = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_volumeId: {
          wishlistId,
          volumeId,
        },
      },
    });
    return !!item;
  } catch (error) {
    console.error("Check wishlist item exists error:", error);
    throw error;
  }
};

export const getOrCreateAnonWishlist = async (): Promise<Wishlist> => {
  try {
    const profileId = await getOrCreateAnonUser();

    const existing = await prisma.wishlist.findUnique({
      where: {
        profileId,
      },
    });

    if (existing && !existing.deletedAt) {
      return existing;
    }

    return await createWishlist(profileId);
  } catch (error) {
    console.error("Get or create anonymous wishlist error:", error);
    throw error;
  }
};

export const addToAnonWishlist = async (
  volumeId: string,
  title: string,
  data?: Partial<
    Omit<Prisma.WishlistItemCreateInput, "wishlist" | "volumeId" | "title">
  >,
): Promise<WishlistItem> => {
  try {
    const wishlist = await getOrCreateAnonWishlist();
    return await addWishlistItem(wishlist.id, volumeId, title, data);
  } catch (error) {
    console.error("Add to anonymous wishlist error:", error);
    throw error;
  }
};

export const getAnonWishlistWithItems = async (): Promise<
  Wishlist & {
    items: WishlistItem[];
  }
> => {
  try {
    const wishlist = await getOrCreateAnonWishlist();
    return await getWishlistWithItems(wishlist.id);
  } catch (error) {
    console.error("Get anonymous wishlist with items error:", error);
    throw error;
  }
};
