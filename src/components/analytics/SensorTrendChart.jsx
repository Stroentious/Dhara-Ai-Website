import React from 'react';
import { Droplets, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const SensorTrendChart = ({ data, title, type = 'moistureTemp' }) => {
  if (type === 'moistureTemp') {
    return (
      <div className="agri-card p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          Soil Moisture (%) & Temperature (°C) Trends
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-agri-800" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={12} domain={[10, 40]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area yAxisId="left" type="monotone" dataKey="moisture" name="Soil Moisture (%)" stroke="#3b82f6" fillOpacity={1} fill="url(#moistureGrad)" strokeWidth={2.5} />
              <Area yAxisId="right" type="monotone" dataKey="temp" name="Soil Temp (°C)" stroke="#f59e0b" fillOpacity={1} fill="url(#tempGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="agri-card p-6">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        Soil pH & Electrical Conductivity (EC)
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-agri-800" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis yAxisId="left" stroke="#10b981" fontSize={12} domain={[4, 9]} />
            <YAxis yAxisId="right" orientation="right" stroke="#a855f7" fontSize={12} domain={[0, 4]} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line yAxisId="left" type="monotone" dataKey="ph" name="pH Level" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="ec" name="EC (dS/m)" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
