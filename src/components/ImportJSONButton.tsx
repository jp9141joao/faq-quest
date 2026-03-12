import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { FAQItem } from '../types';

interface ImportJSONButtonProps {
  onImport: (items: Omit<FAQItem, 'id'>[]) => void;
}

export const ImportJSONButton: React.FC<ImportJSONButtonProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = (e.target?.result as string || '').trim();
        if (!content) {
          alert('The file is empty.');
          return;
        }

        const data = JSON.parse(content);

        if (!Array.isArray(data)) {
          alert('The file must contain a list (array) of questions. The current format is not valid.');
          return;
        }

        const validItems: Omit<FAQItem, 'id'>[] = [];
        data.forEach((item, index) => {
          // Basic validation
          if (
            (item.question || item.pergunta_en || item.pergunta_pt || item.pergunta) && 
            (item.answer || item.resposta_en || item.resposta_pt || item.resposta)
          ) {
            validItems.push({
              question: item.question || item.pergunta_en || item.pergunta_pt || item.pergunta || '',
              answer: item.answer || item.resposta_en || item.resposta_pt || item.resposta || '',
              keywords: Array.isArray(item.keywords) ? item.keywords : (Array.isArray(item.keywords_en) ? item.keywords_en : (Array.isArray(item.keywords_pt) ? item.keywords_pt : [])),
            });
          } else {
            console.warn(`Item at index ${index} is invalid and was skipped.`);
          }
        });

        if (validItems.length > 0) {
          onImport(validItems);
          alert(`${validItems.length} questions imported successfully!`);
        } else {
          alert('No valid questions found in the file.');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Error reading JSON file. Please check the format.');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold transition-colors shadow-sm"
      >
        <Upload className="w-4 h-4" />
        Import JSON
      </button>
    </>
  );
};
