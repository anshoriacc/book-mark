"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { BookCarousel } from "./book-carousel";

type Subject = {
  subject: string;
  title: string;
};

const BOOK_SUBJECTS: Subject[] = [
  { subject: "wildlife", title: "Wildlife" },
  { subject: "science", title: "Science" },
  { subject: "history", title: "History" },
  { subject: "technology", title: "Technology" },
  { subject: "fiction", title: "Fiction" },
  { subject: "mystery", title: "Mystery" },
  { subject: "romance", title: "Romance" },
  { subject: "adventure", title: "Adventure" },
  { subject: "fantasy", title: "Fantasy" },
  { subject: "biography", title: "Biography" },
  { subject: "philosophy", title: "Philosophy" },
  { subject: "psychology", title: "Psychology" },
  { subject: "economics", title: "Economics" },
  { subject: "art", title: "Art" },
  { subject: "music", title: "Music" },
  { subject: "cooking", title: "Cooking" },
  { subject: "travel", title: "Travel" },
  { subject: "nature", title: "Nature" },
  { subject: "sports", title: "Sports" },
  { subject: "education", title: "Education" },
];

function getRandomSubjects(items: Subject[], count: number): Subject[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const BookRandomCarousel = () => {
  const [randomSubjects, setRandomSubjects] = useState<Subject[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomSubjects(getRandomSubjects(BOOK_SUBJECTS, 5));
  }, []);

  if (randomSubjects === null) {
    return null;
  }

  return (
    <section className="space-y-8">
      {randomSubjects.map((item, index) => (
        <motion.div
          key={item.subject}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}>
          <BookCarousel subject={item.subject} title={item.title} />
        </motion.div>
      ))}
    </section>
  );
};
