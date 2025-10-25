"use client";

import React from "react";
import Link from "next/link";
import { BookMarkedIcon } from "lucide-react";
import { motion } from "motion/react";

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
            <motion.div initial={false} className="h-20 w-40">
              <BookMarkedIcon />
            </motion.div>
          ) : (
            <Link href="/" className="flex items-center gap-0.5 font-semibold">
              <BookMarkedIcon />
              Bookmark
            </Link>
          )}
        </motion.div>
      </motion.header>
    </div>
  );
};
