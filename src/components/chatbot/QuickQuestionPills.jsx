import React from 'react';
import { HelpCircle } from 'lucide-react';

export const QuickQuestionPills = ({ onSelectQuestion }) => {
  const questions = [
    'What is the moisture level of Pole 3?',
    'Which zone needs irrigation?',
    'Show me the lowest moisture reading.',
    'What is the current pump status?',
    'What is the optimal soil pH for apples?'
  ];

  return (
    <div className="mb-4">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2 flex items-center gap-1">
        <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        Suggested Quick Prompts:
      </span>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion(q)}
            className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-agri-900 hover:bg-slate-200 dark:hover:bg-agri-850 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-agri-800 hover:border-emerald-500 transition-all text-left"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
