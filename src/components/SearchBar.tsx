import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-12 py-4 bg-white border-none rounded-2xl shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-lg placeholder:text-slate-400"
          placeholder="Digite sua dúvida (ex: senha, pagamento...)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 flex justify-center"
      >
        <p className="text-sm text-slate-500">
          Busque instantaneamente em nossa base de conhecimento
        </p>
      </motion.div>
    </div>
  );
};
