import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-dhara-surfaceBorder/60 bg-dhara-slate py-12 text-xs text-slate-400">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center text-slate-950 font-bold">
                <Sprout className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-base text-slate-100 tracking-tight">
                DHARA AI
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Intelligent Precision Irrigation & Farm Intelligence Platform. Combining real-time
              soil telemetry, connected field devices, and AI advisory for optimal crop yield.
            </p>
          </div>

          {/* Navigation Col 1 */}
          <div className="space-y-2.5">
            <div className="text-slate-200 font-bold text-xs uppercase tracking-wider">
              Technology
            </div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/technology" className="hover:text-emerald-400 transition-colors">
                  Field Sensors
                </Link>
              </li>
              <li>
                <Link to="/hardware" className="hover:text-emerald-400 transition-colors">
                  ESP32 Hardware
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  LoRaWAN Data Flow
                </Link>
              </li>
              <li>
                <Link to="/ai" className="hover:text-emerald-400 transition-colors">
                  AI Decision Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col 2 */}
          <div className="space-y-2.5">
            <div className="text-slate-200 font-bold text-xs uppercase tracking-wider">
              Solutions
            </div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/solutions" className="hover:text-emerald-400 transition-colors">
                  Precision Irrigation
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-emerald-400 transition-colors">
                  Soil Health Monitoring
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="hover:text-emerald-400 transition-colors">
                  Water Intelligence
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-emerald-400 transition-colors">
                  Automated Fertigation
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Col 3 */}
          <div className="space-y-2.5">
            <div className="text-slate-200 font-bold text-xs uppercase tracking-wider">Company</div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About Dhara AI
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Engineering
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Portal Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div>© 2026 Dhara AI. All rights reserved. Precision Irrigation & Farm Intelligence.</div>
          <div className="flex items-center space-x-4">
            <span>Soil NPK/pH/EC</span>
            <span>•</span>
            <span>LoRaWAN Gateway</span>
            <span>•</span>
            <span>Deterministic Safety</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
