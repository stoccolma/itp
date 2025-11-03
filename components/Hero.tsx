'use client';

import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroProps {
  quote: string;
  subline: string;
}

export function Hero({ quote, subline }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {quote}
        </motion.h1>
        
        <motion.p
          className="font-body text-lg md:text-xl text-[var(--ink)]/70 max-w-2xl mx-auto"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subline}
        </motion.p>
      </div>

      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[var(--ink)]/50 hover:text-[var(--ink)] transition-colors"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        aria-label="Scroll to content"
      >
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </motion.button>
    </section>
  );
}
