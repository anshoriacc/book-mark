import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";

export type AnonCtx = {
  profileId: string;
  setCookie?: string | null; // add to your route response header if present
};

export async function getOrCreateAnon(): Promise<AnonCtx> {
  const jar = await cookies();
  const sid = jar.get("sid")?.value;

  // try existing session
  if (sid) {
    const s = await prisma.session.findUnique({
      where: { id: sid },
      select: { id: true, profileId: true, expiresAt: true },
    });
    if (s && s.expiresAt > new Date()) {
      await prisma.session.update({
        where: { id: s.id },
        data: { lastSeenAt: new Date() },
      });
      return { profileId: s.profileId, setCookie: null };
    }
  }

  // create new anonymous profile + session
  const profile = await prisma.profile.create({
    data: { kind: "anonymous" },
    select: { id: true },
  });

  const headersList = await headers();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);

  const session = await prisma.session.create({
    data: {
      profileId: profile.id,
      userAgent: headersList.get("user-agent") ?? undefined,
      expiresAt,
    },
    select: { id: true, profileId: true },
  });

  const setCookie = [
    `sid=${session.id}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${60 * 60 * 24 * 90}`,
  ].join("; ");

  return { profileId: session.profileId, setCookie };
}
