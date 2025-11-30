import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, User, Menu, X, Car, Search, Phone, Mail, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TranslationProvider, useTranslation } from './components/TranslationProvider';
import LanguageSelector from './components/LanguageSelector';

function LayoutContent({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', label: t('nav.home'), page: 'Home' },
    { name: 'Browse Cars', label: t('nav.browseCars'), page: 'SearchResults' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F11]">
      {/* Custom Theme */}
      <style>{`
        :root {
          --background: #0F0F11;
          --card: #1A1A1C;
          --border: #2A2A2D;
          --accent: #FF5F2D;
          --text-primary: #FFFFFF;
          --text-secondary: #A1A1A7;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: var(--border) var(--background);
        }

        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        *::-webkit-scrollbar-track {
          background: var(--background);
        }

        *::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: var(--accent);
        }

        body {
          background: var(--background);
        }
      `}</style>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0F0F11]/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-[#2A2A2D]/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-11 h-11 bg-gradient-to-br from-[#FF5F2D] to-[#FF5F2D]/70 rounded-xl flex items-center justify-center shadow-lg shadow-[#FF5F2D]/20"
              >
                <Car className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold text-white hidden sm:block">
                Car<span className="text-[#FF5F2D]">Market</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="relative px-5 py-2.5 rounded-xl font-medium transition-all group"
                >
                  <span className={`relative z-10 ${
                    currentPageName === link.page
                      ? 'text-[#FF5F2D]'
                      : 'text-[#A1A1A7] group-hover:text-white'
                  }`}>
                    {link.label}
                  </span>
                  {currentPageName === link.page && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-[#FF5F2D]/10 rounded-xl border border-[#FF5F2D]/20"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSelector />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 hover:bg-[#2A2A2D] rounded-xl transition-colors group"
              >
                <Heart className="w-5 h-5 text-[#A1A1A7] group-hover:text-[#FF5F2D] transition-colors" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 hover:bg-[#2A2A2D] rounded-xl transition-colors group"
              >
                <User className="w-5 h-5 text-[#A1A1A7] group-hover:text-[#FF5F2D] transition-colors" />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 hover:bg-[#2A2A2D] rounded-xl transition-colors"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#1A1A1C]/98 backdrop-blur-xl border-t border-[#2A2A2D] overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.page}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={createPageUrl(link.page)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 rounded-xl font-medium transition-all ${
                        currentPageName === link.page
                          ? 'bg-gradient-to-r from-[#FF5F2D] to-[#FF5F2D]/80 text-white shadow-lg shadow-[#FF5F2D]/20'
                          : 'text-[#A1A1A7] hover:bg-[#2A2A2D] hover:text-white'
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Actions */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4 border-t border-[#2A2A2D] mt-4"
                >
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[#A1A1A7] text-sm">Language</span>
                    <LanguageSelector />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed nav */}
      <div className="h-20" />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#1A1A1C] to-[#0F0F11] border-t border-[#2A2A2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF5F2D] to-[#FF5F2D]/70 rounded-xl flex items-center justify-center shadow-lg shadow-[#FF5F2D]/20">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Car<span className="text-[#FF5F2D]">Market</span>
                </span>
              </div>
              <p className="text-[#A1A1A7] max-w-md leading-relaxed mb-6">
                {t('footer.description')}
              </p>
              <div className="flex gap-3">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="w-10 h-10 bg-[#2A2A2D] hover:bg-[#FF5F2D] rounded-xl flex items-center justify-center transition-colors group"
                >
                  <Mail className="w-5 h-5 text-[#A1A1A7] group-hover:text-white transition-colors" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="w-10 h-10 bg-[#2A2A2D] hover:bg-[#FF5F2D] rounded-xl flex items-center justify-center transition-colors group"
                >
                  <Phone className="w-5 h-5 text-[#A1A1A7] group-hover:text-white transition-colors" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">{t('footer.quickLinks')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to={createPageUrl('Home')}
                    className="text-[#A1A1A7] hover:text-[#FF5F2D] transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl('SearchResults')}
                    className="text-[#A1A1A7] hover:text-[#FF5F2D] transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t('nav.browseCars')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-6">{t('footer.contact')}</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-[#A1A1A7]">
                  <Mail className="w-4 h-4 text-[#FF5F2D]" />
                  {t('footer.email')}
                </li>
                <li className="flex items-center gap-3 text-[#A1A1A7]">
                  <Phone className="w-4 h-4 text-[#FF5F2D]" />
                  {t('footer.phone')}
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#2A2A2D] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A1A1A7] text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#A1A1A7] hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#A1A1A7] hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <TranslationProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </TranslationProvider>
  );
}