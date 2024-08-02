import React from "react";
import { motion } from "framer-motion";

const Check = () => {
  return (
    <motion.svg
      stroke="currentColor"
      fill="none"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.polyline
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        strokeWidth={2}
        points="4 12 9 17 20 6"
      ></motion.polyline>
    </motion.svg>
  );
};

export default Check;
