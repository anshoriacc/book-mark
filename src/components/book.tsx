import React from "react";
import { TBookVolume } from "@/server/actions/type";
import { Card } from "./ui/card";
import Image from "next/image";
import dayjs from "dayjs";
import { StarIcon } from "lucide-react";

type Props = {
  data: TBookVolume;
};

export const Book = ({ data }: Props) => {
  const year = data.volumeInfo?.publishedDate
    ? dayjs(data.volumeInfo?.publishedDate).format("YYYY")
    : null;

  return (
    <Card className="grid aspect-3/2 grid-cols-[auto_1fr] gap-2 overflow-hidden p-2 text-sm">
      <div className="aspect-2/3 h-full max-h-54 overflow-hidden rounded-sm">
        <Image
          src={data.volumeInfo?.imageLinks?.thumbnail ?? ""}
          alt={data.volumeInfo?.title}
          width={144}
          height={216}
          placeholder="empty"
          className="aspect-2/3 h-full max-h-54 w-fit rounded-sm bg-neutral-200 object-cover dark:bg-neutral-800"
        />
      </div>

      <div className="flex flex-col gap-1">
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
  );
};
