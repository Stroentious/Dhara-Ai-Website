import React from 'react';
import { Sparkles, CheckCircle, Clock } from 'lucide-react';

export const RecommendationWidget = ({ recommendation, onApplyRecommendation }) => {
  const { zoneName, reason, suggestedDurationMinutes } = recommendation;

  return (
    <div className="agri-card p-6 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 dark:from-agri-900 dark:via-agri-900 dark:to-agri-950 border-emerald-300 dark:border-emerald-800/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Irrigation Recommendation</h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400/80 font-medium">Derived from Field Telemetry</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          Target: {zoneName.split('—')[0].trim()}
        </span>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-agri-950/80 border border-slate-200 dark:border-agri-850 my-4 shadow-sm dark:shadow-none">
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium flex items-start gap-2">
          <span className="text-amber-500 font-bold">⚠️</span>
          {reason}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-agri-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Suggested Runtime: <b className="text-slate-900 dark:text-white">{suggestedDurationMinutes} minutes</b>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Priority: High</span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={onApplyRecommendation}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
        >
          <CheckCircle className="w-4 h-4" />
          EXECUTE RECOMMENDED IRRIGATION
        </button>
      </div>
    </div>
  );
};
