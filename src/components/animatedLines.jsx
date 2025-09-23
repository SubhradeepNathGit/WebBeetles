/* eslint-disable no-unused-vars */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const textLines = [
  { text: "Choose What You Love", align: "text-right", color: "text-purple-500", direction: "right" },
  { text: "Learn How You Want", align: "text-left", direction: "left" },
  { text: "Master What You Need", align: "text-right", direction: "right" },
  { text: "Makes it Possible", align: "text-left", direction: "left" },
];

// Container controls stagger
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.6 },
  },
};

// Slide-through variant
const lineVariants = (direction) => {
  const isRight = direction === "right";
  return {
    hidden: {
      x: isRight ? "100vw" : "-100vw", // start off-screen
      opacity: 0,
    },
    visible: {
      x: 0, // center
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
    exit: {
      x: isRight ? "-100vw" : "100vw", // slide out opposite side
      opacity: 0,
      transition: { duration: 1, ease: "easeIn" },
    },
  };
};

export default function HeroText() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: false });

  return (
    <section
      ref={ref}
      className="relative flex flex-col justify-center min-h-screen bg-black text-white px-6 md:px-12"
    >
      {/* Animated text */}
      <motion.div
        className="flex flex-col gap-20 w-full"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "exit"}
      >
        {textLines.map((line, i) => (
          <motion.p
            key={i}
            variants={lineVariants(line.direction)}
            className={`text-3xl md:text-6xl font-medium transition-colors duration-300 hover:text-purple-500 ${line.align} ${line.color || ""}`}
          >
            {line.text}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
}
