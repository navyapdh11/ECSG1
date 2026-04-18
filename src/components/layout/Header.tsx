'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, Calendar, Trophy, DollarSign, Home, Sun, Moon, Globe } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { languages, type Language } from '@/lib/i18n';

const navItems = [
  { label: 'Home', href: '#hero', icon: Home },
  { label: 'Booking', href: '#booking', icon: Calendar },
  { label: 'Pricing', href: '#pricing', icon: DollarSign },
  { label: 'Rewards', href: '#gamification', icon: Trophy },
];

export function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenu } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Scroll handler - throttled
  const handleScroll = useCallback(() => {
    setScrolled((prev) => {
      const newScrolled = window.scrollY > 20;
      return newScrolled !== prev ? newScrolled : prev;
    });
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  // Dark mode - #12
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Close mobile menu on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setMobileMenu(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen, setMobileMenu]);

  const textColor = scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white/90';
  const hoverBg = scrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/10';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="ECSG1 Home">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary-600 transition-transform group-hover:rotate-12" />
              <motion.div
                className="absolute inset-0 w-8 h-8 text-primary-400"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              >
                <Sparkles />
              </motion.div>
            </div>
            <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
              ECSG1
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${textColor} ${hoverBg}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}

            {/* Language Toggle - #18 */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${textColor} ${hoverBg}`}
                aria-label="Change language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">{languages.find(l => l.code === lang)?.flag}</span>
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[160px]"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          l.code === lang ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle - #12 */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${textColor} ${hoverBg}`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' : 'text-white hover:bg-white/10'
            }`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 pb-4"
              role="menu"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
                      role="menuitem"
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                {/* Mobile dark mode + language */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <div className="flex gap-2 ml-auto">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`text-lg ${l.code === lang ? 'opacity-100' : 'opacity-40'}`}
                      >
                        {l.flag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
