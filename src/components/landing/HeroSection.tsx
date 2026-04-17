'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Clock, Leaf } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Shield,
    title: 'Trusted & Insured',
    description: 'All cleaners are background-checked and fully insured',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book cleaning services at your convenience, 7 days a week',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Products',
    description: 'We use only safe, environmentally friendly cleaning products',
  },
];

// Fixed: Pre-compute particle data once using useMemo
function useParticleData() {
  return useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 1200,
      y: Math.random() * 800,
      scale: Math.random() * 0.5 + 0.5,
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
  }, []);
}

export function HeroSection() {
  const particles = useParticleData();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700"
    >
      {/* Animated Background Particles - Fixed: stable positions + a11y */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/10"
            initial={{ x: p.x, y: p.y, scale: p.scale }}
            animate={{
              y: [p.y, p.y - 100],
              x: [p.x, p.x + (Math.random() * 50 - 25)],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: p.delay,
            }}
            style={{ width: p.width, height: p.height }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full mb-8"
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">AI-Powered Cleaning Services</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Professional Cleaning,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              Simplified
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto"
          >
            Book trusted cleaners in seconds. Earn rewards with every booking. 
            Experience the future of home and office cleaning.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="#booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              Book Now
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
            >
              View Pricing
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="inline-flex p-3 bg-white/10 backdrop-blur-sm rounded-lg mb-3" aria-hidden="true">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
