import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, gradient }) => {
  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200/60">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative">
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
        
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200/50 transition-colors"></div>
    </div>
  );
};

export default FeatureCard;