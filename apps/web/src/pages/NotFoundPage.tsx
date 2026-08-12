import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
        404 - Page Not Found
      </h1>
      <p className="text-slate-400 max-w-md text-sm">
        The field module or route you are looking for does not exist or is scheduled for a future
        implementation phase.
      </p>
      <Link to="/">
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dhara AI Overview</span>
        </Button>
      </Link>
    </div>
  );
};
