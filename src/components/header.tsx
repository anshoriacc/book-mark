"use client";

import React from "react";
import Link from "next/link";
import { BookMarkedIcon, HeartIcon, HomeIcon } from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "./theme-toggle";

export const Header = () => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="pointer-events-none fixed top-6 left-0 z-404 flex w-full">
      <motion.header
        layout
        transition={{
          type: "spring",
          bounce: isHovered ? 0.3 : 0.5,
        }}
        initial={false}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ borderRadius: 20 }}
        className="bg-background/50 pointer-events-auto mx-auto flex min-h-10 w-fit min-w-0 items-center gap-4 overflow-hidden border-[0.5px] px-2.5 py-2 shadow-md backdrop-blur-md">
        <motion.div
          transition={{
            type: "spring",
            bounce: isHovered ? 0.3 : 0.5,
          }}
          initial={{
            scale: 0.9,
            opacity: 0,
            filter: "blur(4px)",
            originX: 0.5,
            originY: 0.5,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            originX: 0.5,
            originY: 0.5,
            transition: {
              delay: 0.1,
            },
          }}
          key={isHovered ? "expanded" : "collapsed"}>
          {isHovered ? (
            <motion.div initial={false} className="flex w-40 flex-col gap-2.5">
              <div className="flex justify-between gap-4">
                <Link href="/">
                  <BookMarkedIcon />
                </Link>

                <ThemeToggle />
              </div>

              <div className="h-px w-full bg-neutral-500" />

              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-sm px-1 py-0.5 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <HomeIcon className="size-4" />
                  <span className="text-sm">Home</span>
                </Link>

                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 rounded-sm px-1 py-0.5 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <HeartIcon className="size-4" />
                  <span className="text-sm">Wishlist</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <Link href="/" className="flex items-center gap-0.5 font-semibold">
              <BookMarkedIcon />
              BookMark
            </Link>
          )}
        </motion.div>
      </motion.header>
    </div>
  );
};
