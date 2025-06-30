import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, value, label }) => {
  return (
    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-600 font-medium">{label}</div>
    </div>
  );
};

export default StatsCard;