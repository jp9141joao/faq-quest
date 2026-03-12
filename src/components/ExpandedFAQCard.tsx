import React from 'react';
import { FAQItem } from '../types';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface ExpandedFAQCardProps {
  item: FAQItem;
  searchTerm: string;
  onClose: () => void;
}

export const ExpandedFAQCard: React.FC<ExpandedFAQCardProps> = ({ item, searchTerm, onClose }) => {
  const highlightText = (text: string, highlight: string) => {
    if (!text) return '';
    if (!highlight.trim()) {
      return text;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="search-highlight">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderFormattedText = (text: string, highlight: string) => {
    if (!text) return '';
    const redParts = text.split(/(\[\[.*?\]\])/g);
    
    return (
      <>
        {redParts.map((part, i) => {
          if (part.startsWith('[[') && part.endsWith(']]')) {
            const content = part.slice(2, -2);
            return (
              <span key={i} className="text-red-500 font-medium bg-red-50 px-0.5 rounded border border-red-100">
                {highlightText(content, highlight)}
              </span>
            );
          }
          return <React.Fragment key={i}>{highlightText(part, highlight)}</React.Fragment>;
        })}
      </>
    );
  };

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Set initial scroll to the middle where the content starts
        containerRef.current.scrollTop = window.innerHeight;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div
        ref={containerRef}
        className="fixed inset-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-white shadow-2xl z-50 overflow-y-scroll overscroll-none touch-pan-y"
        style={{ 
          backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px'
        }}
      >
        <div className="pt-[150vh] pb-[200vh]">
          <div className="p-4 md:p-6 flex justify-end">
            <button
              onClick={onClose}
              className="p-3 text-slate-500 hover:text-slate-800 bg-white shadow-lg rounded-full transition-all hover:scale-110 active:scale-95"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 md:p-12 bg-white shadow-xl rounded-[2.5rem] mx-4 md:mx-8 border border-slate-100">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-tight whitespace-pre-wrap">
                {highlightText(item.question, searchTerm)}
              </h2>
              
              <div className="prose prose-slate prose-lg max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {renderFormattedText(item.answer, searchTerm)}
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-full border border-slate-200"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
