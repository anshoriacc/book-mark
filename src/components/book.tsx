"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { HeartIcon, StarIcon } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner";

import { TBookVolume } from "@/server/actions/type";
import { Card } from "./ui/card";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "./ui/responsive-dialog";
import { Toggle } from "./ui/toggle";
import {
  useAddToWishlistMutation,
  useDeleteWishlistItemMutation,
  useGetAnonWishlistQuery,
} from "@/hooks/api/wishlist";

type Props = {
  data: TBookVolume;
};

export const Book = ({ data }: Props) => {
  const router = useRouter();
  const wishlistQuery = useGetAnonWishlistQuery();

  const addToWishlistMutation = useAddToWishlistMutation();
  const deleteWishlistItemMutation = useDeleteWishlistItemMutation();

  const isInWishlist = wishlistQuery.data?.items.some(
    item => item.volumeId === data.id,
  );

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      const item = wishlistQuery.data?.items.find(
        item => item.volumeId === data.id,
      );
      if (item) {
        deleteWishlistItemMutation.mutate(item.id, {
          onSuccess: () => {
            toast.success("Removed from wishlist", {
              action: {
                label: "View Wishlist",
                onClick: () => router.push("/wishlist"),
              },
            });
          },
          onError: () => {
            toast.error("Failed to remove from wishlist. Please try again.");
          },
        });
      }
    } else {
      addToWishlistMutation.mutate(
        {
          volumeId: data.id,
          title: data.volumeInfo?.title ?? "Untitled",
          data: { rawData: data },
        },
        {
          onSuccess: () => {
            toast.success("Added to wishlist", {
              action: {
                label: "View Wishlist",
                onClick: () => router.push("/wishlist"),
              },
            });
          },
          onError: () => {
            toast.error("Failed to add to wishlist. Please try again.");
          },
        },
      );
    }
  };

  const year = data.volumeInfo?.publishedDate
    ? dayjs(data.volumeInfo?.publishedDate).format("YYYY")
    : null;

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Card className="grid aspect-3/2 cursor-pointer grid-cols-[auto_1fr] gap-2 overflow-hidden p-2 text-sm select-none">
          <div className="aspect-2/3 h-full max-h-54 overflow-hidden rounded-sm">
            {data.volumeInfo?.imageLinks?.thumbnail ? (
              <Image
                src={data.volumeInfo?.imageLinks?.thumbnail ?? ""}
                alt={data.volumeInfo?.title}
                width={144}
                height={216}
                placeholder="empty"
                className="aspect-2/3 h-full max-h-54 w-fit rounded-sm bg-neutral-200 object-cover dark:bg-neutral-800"
              />
            ) : (
              <div className="flex aspect-2/3 h-full max-h-54 w-fit items-center justify-center rounded-sm bg-neutral-200 text-xs text-neutral-500 dark:bg-neutral-800">
                No Image
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <h4 className="line-clamp-2 text-base font-semibold">
                {data.volumeInfo?.title}
              </h4>
              {(data.volumeInfo?.authors || data.volumeInfo?.publishedDate) && (
                <span className="line-clamp-2 text-neutral-500">
                  {data.volumeInfo?.authors && (
                    <span>{data.volumeInfo?.authors?.join(", ")} ・</span>
                  )}{" "}
                  {year && <span>{year}</span>}
                </span>
              )}
            </div>

            {(data.volumeInfo?.pageCount || data.volumeInfo?.description) && (
              <div className="rounded-sm border p-1 text-xs">
                {(data.volumeInfo?.pageCount ?? 0) > 0 && (
                  <span className="">{data.volumeInfo?.pageCount} pages</span>
                )}
                {data.volumeInfo?.description && (
                  <span className="line-clamp-3 text-neutral-500">
                    {data.volumeInfo?.description}
                  </span>
                )}
              </div>
            )}

            {data.volumeInfo.averageRating && (
              <div className="mt-auto flex items-center justify-end gap-1">
                <StarIcon className="size-4 fill-yellow-500 text-yellow-500" />
                <span className="text- font-semibold">
                  {data.volumeInfo.averageRating}
                  <span className="text-neutral-500">/5.0</span>
                </span>
                {(data.volumeInfo.ratingsCount ?? 0) > 0 && (
                  <span className="text-neutral-500">
                    ({data.volumeInfo.ratingsCount})
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent className="max-h-9/10 overflow-y-auto sm:max-w-3xl">
        <ResponsiveDialogTitle className="sr-only">
          {data.volumeInfo?.title}
        </ResponsiveDialogTitle>

        <ResponsiveDialogBody>
          <div className="grid gap-2 overflow-hidden p-2 md:grid-cols-[auto_1fr]">
            <div className="flex flex-col gap-4">
              <div className="mx-auto aspect-2/3 h-full max-h-54 overflow-hidden rounded-sm">
                {data.volumeInfo?.imageLinks?.thumbnail ? (
                  <Image
                    src={data.volumeInfo?.imageLinks?.thumbnail ?? ""}
                    alt={data.volumeInfo?.title}
                    width={144}
                    height={216}
                    placeholder="empty"
                    className="aspect-2/3 h-54 max-h-54 w-fit rounded-sm bg-neutral-200 object-cover md:h-full dark:bg-neutral-800"
                  />
                ) : (
                  <div className="flex aspect-2/3 h-54 max-h-54 w-fit items-center justify-center rounded-sm bg-neutral-200 text-xs text-neutral-500 dark:bg-neutral-800">
                    No Image
                  </div>
                )}
              </div>

              <Toggle
                aria-label="Toggle bookmark"
                size="sm"
                variant="outline"
                pressed={isInWishlist}
                onPressedChange={handleToggleWishlist}
                disabled={
                  addToWishlistMutation.isPending ||
                  deleteWishlistItemMutation.isPending
                }
                className="mx-auto data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-pink-500 data-[state=on]:*:[svg]:stroke-pink-500">
                <HeartIcon />
                Wishlist
              </Toggle>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <h4 className="text-xl font-semibold">
                  {data.volumeInfo?.title}
                </h4>
                {(data.volumeInfo?.authors ||
                  data.volumeInfo?.publishedDate) && (
                  <span className="text-neutral-500">
                    {data.volumeInfo?.authors && (
                      <span>{data.volumeInfo?.authors?.join(", ")} ・</span>
                    )}{" "}
                    {year && <span>{year}</span>}
                  </span>
                )}
              </div>

              {(data.volumeInfo?.pageCount || data.volumeInfo?.description) && (
                <div className="rounded-sm border p-1">
                  {(data.volumeInfo?.pageCount ?? 0) > 0 && (
                    <span className="">{data.volumeInfo?.pageCount} pages</span>
                  )}
                  {data.volumeInfo?.description && (
                    <span className="line-clamp-10 text-neutral-500">
                      {data.volumeInfo?.description}
                    </span>
                  )}
                </div>
              )}

              {data.volumeInfo.averageRating && (
                <div className="mt-auto flex items-center justify-end gap-1">
                  <StarIcon className="size-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">
                    {data.volumeInfo.averageRating}
                    <span className="text-neutral-500">/5.0</span>
                  </span>
                  {(data.volumeInfo.ratingsCount ?? 0) > 0 && (
                    <span className="text-neutral-500">
                      ({data.volumeInfo.ratingsCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
