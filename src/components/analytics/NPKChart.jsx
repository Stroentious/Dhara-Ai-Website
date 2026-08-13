import React from 'react';
import { Leaf, Waves } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const NPKChart = ({ data, type = 'npk' }) => {
  if (type === 'waterUsage') {
    return (
      <div className="agri-card p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Waves className="w-5 h-5 text-blue-500" />
          Water Usage & Irrigation Volume (Liters)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-agri-800" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="waterUsage" name="Water Usage (Liters)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="agri-card p-6">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        NPK Macronutrient Balance (mg/kg)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-agri-800" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="nitrogen" name="Nitrogen (N)" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="phosphorus" name="Phosphorus (P)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="potassium" name="Potassium (K)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
