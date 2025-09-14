import React from 'react';
import { motion } from 'framer-motion';

interface WormCrawlerProps {
  delay?: number;
}

const WormCrawler: React.FC<WormCrawlerProps> = ({ delay = 0 }) => {
  const colors = ['#ff69b4', '#8a2be2', '#00bfff', '#8bff00', '#ff0040'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = Math.random() * 20 + 10;
  const randomDuration = Math.random() * 10 + 8;

  return (
    <motion.div
      className="worm-crawler"
      style={{
        top: Math.random() * window.innerHeight,
        left: -50,
      }}
      initial={{ x: -50, y: 0 }}
      animate={{
        x: window.innerWidth + 50,
        y: [
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
        ],
      }}
      transition={{
        duration: randomDuration,
        delay: delay / 1000,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <motion.div
        style={{
          width: randomSize,
          height: randomSize,
          backgroundColor: randomColor,
          borderRadius: '50%',
          boxShadow: `0 0 ${randomSize}px ${randomColor}`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default WormCrawler;