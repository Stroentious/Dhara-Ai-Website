import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { X, Droplets, Thermometer, BatteryCharging, Radio, Cpu, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const PoleDetailsModal = ({ poleDetails, onClose }) => {
  if (!poleDetails) return null;

  const { name, zoneName, status, lastUpdated, battery, solarStatus, signalStrength, telemetry, history } = poleDetails;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-agri-900 border border-slate-200 dark:border-agri-800 text-slate-900 dark:text-slate-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-agri-950 hover:bg-slate-200 dark:hover:bg-agri-850 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors border border-slate-200 dark:border-agri-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-agri-800 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center font-black text-lg text-white">
            {name.replace('Pole ', 'P')}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{name} Diagnostics</h2>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400/80 font-medium mt-0.5">{zoneName} • RS485 Field Node • LoRa 868MHz</p>
          </div>
        </div>

        {/* Hardware Status Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-agri-950 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Battery & Solar</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
              {battery}% ({solarStatus})
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">LoRa Signal (RSSI)</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
              <Radio className="w-4 h-4 text-blue-500" />
              {signalStrength} dBm
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Microcontroller</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1">
              <Cpu className="w-4 h-4 text-emerald-500" />
              ESP32-C3
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Last Telemetry Sync</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300 flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {lastUpdated}
            </span>
          </div>
        </div>

        {/* All Sensor Parameters Grid */}
        <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">Live Soil Parameter Readings</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 dark:bg-agri-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Soil Moisture</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{telemetry.moisture}%</span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Soil Temperature</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{telemetry.temperature}°C</span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Soil pH</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{telemetry.ph}</span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">EC (Conductivity)</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{telemetry.ec} <span className="text-xs font-semibold text-slate-500">dS/m</span></span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Nitrogen (N)</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-1 block">{telemetry.nitrogen} <span className="text-xs text-slate-500">mg/kg</span></span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Phosphorus (P)</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-1 block">{telemetry.phosphorus} <span className="text-xs text-slate-500">mg/kg</span></span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Potassium (K)</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-300 mt-1 block">{telemetry.potassium} <span className="text-xs text-slate-500">mg/kg</span></span>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-agri-850">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">RS485 Address</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">0x0{name.replace('Pole ', '')}</span>
          </div>
        </div>

        {/* Historical Charts */}
        <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">24-Hour Telemetry History</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-agri-950 p-4 rounded-xl border border-slate-200 dark:border-agri-850">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              Soil Moisture Trend (%)
            </h4>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-agri-800" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-agri-950 p-4 rounded-xl border border-slate-200 dark:border-agri-850">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-500" />
              Soil Temperature Trend (°C)
            </h4>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-agri-800" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[10, 40]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
