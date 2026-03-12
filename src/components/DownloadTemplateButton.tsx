import React from 'react';
import { Download } from 'lucide-react';

interface DownloadTemplateButtonProps {}

export const DownloadTemplateButton: React.FC<DownloadTemplateButtonProps> = () => {
  const handleDownload = () => {
    const template = [
      {
        "question": "How do I reset my password?",
        "answer": "To reset your password, click on [[Forgot my password]] on the login screen.",
        "keywords": ["password", "reset", "login"]
      },
      {
        "question": "What payment methods are accepted?",
        "answer": "We accept [[Credit Card]], [[Pix]] and [[Bank Slip]].",
        "keywords": ["payment", "card", "pix"]
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'faq_template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium underline flex items-center gap-1"
    >
      <Download className="w-3 h-3" />
      Download JSON Template
    </button>
  );
};
