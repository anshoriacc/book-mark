"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";

type Props = {
  invert?: boolean;
};

export const ThemeToggle = ({ invert = false }: Props) => {
  const { setTheme, theme, systemTheme } = useTheme();
  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <Button
      onClick={toggleTheme}
      aria-label="toggle theme"
      variant="ghost"
      size="icon"
      className="rounded-full p-1 size-6 transition-all hover:bg-white/10 hover:text-inherit">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center justify-center",
            invert && "rotate-180",
          )}>
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
};
