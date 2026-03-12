import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { SearchBar } from './components/SearchBar';
import { FAQCard } from './components/FAQCard';
import { ReorderableFAQItem } from './components/ReorderableFAQItem';
import { ExpandedFAQCard } from './components/ExpandedFAQCard';
import { FAQModal } from './components/FAQModal';
import { ImportJSONButton } from './components/ImportJSONButton';
import { DownloadTemplateButton } from './components/DownloadTemplateButton';
import { FAQItem } from './types';
import { HelpCircle, SearchX, Plus, Globe, FileJson } from 'lucide-react';

export default function App() {
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('faqData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          id: item.id,
          question: item.question || item.pergunta_en || item.pergunta_pt || item.pergunta || '',
          answer: item.answer || item.resposta_en || item.resposta_pt || item.resposta || '',
          keywords: item.keywords || item.keywords_en || item.keywords_pt || [],
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<FAQItem | null>(null);

  // Update document title dynamically
  useEffect(() => {
    if (selectedItem) {
      document.title = selectedItem.question;
    } else {
      document.title = 'Help Center';
    }
  }, [selectedItem]);

  // Save to localStorage whenever faqs change
  useEffect(() => {
    localStorage.setItem('faqData', JSON.stringify(faqs));
  }, [faqs]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const filteredFAQ = useMemo(() => {
    let result = faqs;
    
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      result = faqs.filter((item) => {
        const inQuestion = item.question.toLowerCase().includes(query);
        const inAnswer = item.answer.toLowerCase().includes(query);
        const inKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(query));
        return inQuestion || inAnswer || inKeywords;
      });
    }

    // Return filtered results in their current order
    return result;
  }, [debouncedQuery, faqs]);

  const handleSaveFAQ = (itemData: Omit<FAQItem, 'id'>) => {
    if (editingItem) {
      // Edit existing
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...itemData, id: item.id } : item
        )
      );
    } else {
      // Add new
      const newItem: FAQItem = {
        ...itemData,
        id: Date.now(),
      };
      setFaqs((prev) => [newItem, ...prev]);
    }
    setEditingItem(null);
  };

  const handleDeleteFAQ = (id: number) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleImportJSON = (items: Omit<FAQItem, 'id'>[]) => {
    const newItems: FAQItem[] = items.map((item, index) => ({
      ...item,
      id: Date.now() + index,
    }));
    setFaqs((prev) => [...newItems, ...prev]);
  };

  const handleEditClick = (item: FAQItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <header className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-6"
          >
            <HelpCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4"
          >
            Help Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Find quick answers to your most frequently asked questions in our knowledge base.
          </motion.p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </header>

      {/* Results Section */}
      <main className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {debouncedQuery 
                ? 'Search results'
                : 'Frequently Asked Questions'}
            </h2>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-indigo-600 shadow-sm border border-slate-100">
              {filteredFAQ.length} {filteredFAQ.length === 1 
                ? 'result' 
                : 'results'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <ImportJSONButton onImport={handleImportJSON} />
              <DownloadTemplateButton />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Question
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filteredFAQ.length > 0 ? (
              !debouncedQuery ? (
                <Reorder.Group 
                  axis="y" 
                  values={faqs} 
                  onReorder={setFaqs}
                  className="grid gap-6"
                >
                  {faqs.map((item) => (
                    <ReorderableFAQItem
                      key={item.id}
                      item={item}
                      searchTerm={debouncedQuery}
                      onDelete={handleDeleteFAQ}
                      onEdit={handleEditClick}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </Reorder.Group>
              ) : (
                <div className="grid gap-6">
                  {filteredFAQ.map((item) => (
                    <FAQCard 
                      key={item.id} 
                      item={item} 
                      searchTerm={debouncedQuery} 
                      onDelete={handleDeleteFAQ}
                      onEdit={handleEditClick}
                      onClick={() => setSelectedItem(item)}
                      isDraggable={false}
                    />
                  ))}
                </div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                  <SearchX className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {faqs.length === 0 
                    ? 'No questions added'
                    : 'No results found'}
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-6">
                  {faqs.length === 0 
                    ? 'Start by adding questions to your knowledge base.'
                    : `We couldn't find anything for "${debouncedQuery}". Try using simpler keywords.`}
                </p>
                {faqs.length === 0 ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Add First Question
                  </button>
                ) : (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-slate-400 text-sm">
        <p>© 2026 FAQ Search Pro. All rights reserved.</p>
      </footer>

      <FAQModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFAQ}
        initialData={editingItem}
      />

      <AnimatePresence>
        {selectedItem && (
          <ExpandedFAQCard
            item={selectedItem}
            searchTerm={debouncedQuery}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
