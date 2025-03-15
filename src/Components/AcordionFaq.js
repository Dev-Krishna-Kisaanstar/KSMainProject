import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export function AccordionVariant() {
  const [expanded, setExpanded] = useState(null); // Track which accordion is expanded

  // Toggle the expanded state for each item
  const toggleAccordion = (value) => {
    setExpanded((prev) => (prev === value ? null : value)); // Collapse if already expanded, else expand
  };

  return (
    <div className="flex flex-col w-full">
      {/* Accordion Item 1 */}
      <div className="py-2">
        <motion.div
          onClick={() => toggleAccordion('getting-started')}
          className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 cursor-pointer"
        >
          <div className="flex items-center">
            <ChevronRight
              className={`h-4 w-4 text-zinc-950 transition-transform duration-200 ${
                expanded === 'getting-started' ? 'rotate-90' : ''
              } dark:text-zinc-50`}
            />
            <div className="ml-2 text-zinc-950 dark:text-zinc-50">
              How do I start with Motion-Primitives?
            </div>
          </div>
        </motion.div>
        {expanded === 'getting-started' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="origin-left"
          >
            <p className="pl-6 pr-2 text-zinc-500 dark:text-zinc-400">
              Kick off your experience by setting up Motion-Primitives. This
              section covers the basics of installation and how to add animations
              to your projects. You’ll get familiar with the initial setup and the
              core features quickly.
            </p>
          </motion.div>
        )}
      </div>

      {/* Accordion Item 2 */}
      <div className="py-2">
        <motion.div
          onClick={() => toggleAccordion('animation-properties')}
          className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 cursor-pointer"
        >
          <div className="flex items-center">
            <ChevronRight
              className={`h-4 w-4 text-zinc-950 transition-transform duration-200 ${
                expanded === 'animation-properties' ? 'rotate-90' : ''
              } dark:text-zinc-50`}
            />
            <div className="ml-2 text-zinc-950 dark:text-zinc-50">
              What are the key animation properties?
            </div>
          </div>
        </motion.div>
        {expanded === 'animation-properties' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="origin-left"
          >
            <p className="pl-6 pr-2 text-zinc-500 dark:text-zinc-400">
              Discover a variety of properties to customize your animations. Learn
              to adjust timing, easing, and delays for smoother effects. This
              guide will help you tailor these settings to your app’s needs.
            </p>
          </motion.div>
        )}
      </div>

      {/* Accordion Item 3 */}
      <div className="py-2">
        <motion.div
          onClick={() => toggleAccordion('advanced-features')}
          className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 cursor-pointer"
        >
          <div className="flex items-center">
            <ChevronRight
              className={`h-4 w-4 text-zinc-950 transition-transform duration-200 ${
                expanded === 'advanced-features' ? 'rotate-90' : ''
              } dark:text-zinc-50`}
            />
            <div className="ml-2 text-zinc-950 dark:text-zinc-50">
              How do I use advanced features?
            </div>
          </div>
        </motion.div>
        {expanded === 'advanced-features' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="origin-left"
          >
            <p className="pl-6 pr-2 text-zinc-500 dark:text-zinc-400">
              Advance your skills by using more complex functions of
              Motion-Primitives. Explore how to link animations together, create
              intricate sequences, and interact with motion sensors for dynamic
              effects.
            </p>
          </motion.div>
        )}
      </div>

      {/* Accordion Item 4 */}
      <div className="py-2">
        <motion.div
          onClick={() => toggleAccordion('community-support')}
          className="w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 cursor-pointer"
        >
          <div className="flex items-center">
            <ChevronRight
              className={`h-4 w-4 text-zinc-950 transition-transform duration-200 ${
                expanded === 'community-support' ? 'rotate-90' : ''
              } dark:text-zinc-50`}
            />
            <div className="ml-2 text-zinc-950 dark:text-zinc-50">
              How do I engage with the community?
            </div>
          </div>
        </motion.div>
        {expanded === 'community-support' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="origin-left"
          >
            <p className="pl-6 pr-2 text-zinc-500 dark:text-zinc-400">
              Connect with the Motion-Primitives community for support and
              collaboration. Learn how to contribute, share knowledge, and access
              helpful resources. Stay updated on new updates and collective
              insights.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
