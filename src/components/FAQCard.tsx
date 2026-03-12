import React from 'react';
import { FAQItem } from '../types';
import { motion } from 'motion/react';
import { Trash2, Pencil, GripVertical } from 'lucide-react';

interface FAQCardProps {
  item: FAQItem;
  searchTerm: string;
  onDelete: (id: number) => void;
  onEdit: (item: FAQItem) => void;
  onClick: () => void;
  isDraggable?: boolean;
  dragControls?: any;
}

export const FAQCard: React.FC<FAQCardProps> = ({ 
  item, 
  searchTerm, 
  onDelete, 
  onEdit, 
  onClick, 
  isDraggable = false,
  dragControls
}) => {
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
    // Regex to find [[text]]
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

  return (
    <motion.div
      layoutId={`faq-card-${item.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all group relative cursor-pointer flex gap-4"
    >
      {isDraggable && (
        <div 
          className="flex items-start pt-1 cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-400 transition-colors"
          onPointerDown={(e) => dragControls?.start(e)}
        >
          <GripVertical className="w-5 h-5" />
        </div>
      )}

      <div className="flex-1">
        <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
          title="Edit question"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Delete question"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-3">
        <h3 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors pr-20 whitespace-pre-wrap line-clamp-2">
          {highlightText(item.question, searchTerm)}
        </h3>
      </div>
      
      <p className="text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap line-clamp-3">
        {renderFormattedText(item.answer, searchTerm)}
      </p>
      <div className="flex flex-wrap gap-2">
        {item.keywords.map((keyword, index) => (
          <span
            key={index}
            className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full border border-slate-200"
          >
            #{keyword}
          </span>
        ))}
      </div>
      </div>
    </motion.div>
  );
};
