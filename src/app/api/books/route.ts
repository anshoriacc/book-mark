// app/api/books/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma"; // optional: for BooksCache usage

const ALLOWED = [
  "q",
  "startIndex",
  "maxResults",
  "orderBy",
  "langRestrict",
  "printType",
  "projection",
  "download",
  "filter",
];

function buildForwardParams(params: URLSearchParams) {
  const out = new URLSearchParams();
  for (const key of ALLOWED) {
    const v = params.get(key);
    if (v) out.set(key, v);
  }
  return out;
}

async function fetchFromGoogle(queryParams: URLSearchParams) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?${queryParams.toString()}`;
  const upstream = await fetch(apiUrl, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!upstream.ok) throw new Error(`Upstream error: ${upstream.status}`);
  return upstream.json();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const cookieJar = cookies();

  // 1) Primary query param (explicit q)
  const q = params.get("q")?.trim();

  let effectiveQ = q ?? null;

  // 2) session last-q fallback (cookie)
  if (!effectiveQ) {
    const lastQ = (await cookieJar).get("last_q")?.value;
    if (lastQ) effectiveQ = lastQ;
  }

  // 4) default/fallback query from env or seeded list
  if (!effectiveQ) {
    // prefer an explicit env var BOOKS_DEFAULT_Q, else pick from seeds
    effectiveQ = process.env.BOOKS_DEFAULT_Q ?? null;
    if (!effectiveQ) {
      const seeds = [
        "subject:fiction",
        "subject:programming",
        "bestseller",
        "subject:history",
        "subject:technology",
      ];
      // pick a seed based on small randomness so results vary
      effectiveQ = seeds[Math.floor(Math.random() * seeds.length)];
    }
  }

  // Build forward params using effectiveQ and any other allowed params
  const forward = new URLSearchParams();
  forward.set("q", effectiveQ);
  // forward allowed other numeric params from incoming request (e.g., maxResults/startIndex)
  for (const key of [
    "startIndex",
    "maxResults",
    "orderBy",
    "langRestrict",
    "printType",
    "projection",
    "filter",
    "download",
  ]) {
    const v = params.get(key);
    if (v) forward.set(key, v);
  }

  // Save last_q cookie when q was explicitly provided (or we can always update it)
  // Use a non-HttpOnly cookie so client-side UI can also prefill search box (optional)
  const cookieValue = effectiveQ; // maybe encodeURIComponent if you prefer
  const cookieParts = [
    `last_q=${encodeURIComponent(cookieValue)}`,
    "Path=/",
    "Max-Age=2592000", // 30 days
    // do NOT mark Secure/HttpOnly if client-side JS must read it; if only server reads it, mark HttpOnly
  ];
  // If you want JS-readable cookie (prefill the input), *do not* add HttpOnly.
  // If you prefer server-only, add HttpOnly and Secure flags (but client can't read it).
  (await cookieJar).set("last_q", cookieValue, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  // Now fetch from Google with forward params
  try {
    const data = await fetchFromGoogle(forward);
    const items = (data.items ?? []).map((x: any) => {
      const v = x.volumeInfo ?? {};
      return {
        id: x.id,
        title: v.title,
        subtitle: v.subtitle,
        authors: v.authors ?? [],
        publisher: v.publisher ?? null,
        publishedDate: v.publishedDate ?? null,
        categories: v.categories ?? [],
        pageCount: v.pageCount ?? null,
        language: v.language ?? null,
        thumbnailUrl:
          v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail ?? null,
        infoLink: v.infoLink ?? null,
        previewLink: v.previewLink ?? null,
        saleInfo: x.saleInfo ?? null,
        accessInfo: x.accessInfo ?? null,
        raw: x,
      };
    });

    return NextResponse.json({
      totalItems: data.totalItems ?? items.length,
      items,
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
