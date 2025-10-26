"use client";
import { motion } from "framer-motion";

export function AnimatedTick() {
  return (
    <motion.div
        className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
    >
        <svg
            className="w-16 h-16 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    delay: 0.5,
                    duration: 0.5,
                    ease: "easeOut",
                }}
                d="M20 6L9 17l-5-5"
            />
        </svg>
    </motion.div>
  );
}
