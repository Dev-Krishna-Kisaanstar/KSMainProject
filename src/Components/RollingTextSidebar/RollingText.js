// RollingText.js
import React from 'react';
import { motion } from 'framer-motion';

const RollingText = ({ text, style }) => {
  const characters = Array.from(text);

  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
          style={{ display: 'inline-block', ...style }} // Apply additional styles
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default RollingText;