import React, { useState, useEffect } from 'react';
import { Video, Users, Clock, Shield, CheckCircle, ArrowRight, Sparkles, Brain, MessageSquare } from 'lucide-react';
import InterviewLauncher from './components/InterviewLauncher';
import FeatureCard from './components/FeatureCard';
import StatsCard from './components/StatsCard';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isStarted) {
    return <InterviewLauncher onBack={() => setIsStarted(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  AI Interview Pro
                </h1>
                <p className="text-sm text-slate-500 font-medium">Powered by Tavus AI</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live & Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Next-Gen AI Interview Experience</span>
            </div>
            
            <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Practice Interviews with
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hyper-Realistic AI
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Experience the future of interview preparation with our AI-powered platform. 
              Get real-time feedback, practice unlimited scenarios, and boost your confidence 
              with lifelike video conversations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => setIsStarted(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
              >
                <Video className="w-5 h-5" />
                <span>Start AI Interview</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </button>
              
              <div className="flex items-center space-x-2 text-slate-600">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">No signup required</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <StatsCard icon={Users} value="10K+" label="Interviews Completed" />
              <StatsCard icon={Clock} value="30min" label="Average Session" />
              <StatsCard icon={Shield} value="100%" label="Privacy Protected" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Choose AI Interview Pro?
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our cutting-edge AI technology provides the most realistic interview experience possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="Advanced AI Interviewer"
              description="Powered by Tavus AI technology for natural, human-like conversations that adapt to your responses."
              gradient="from-blue-500 to-indigo-500"
            />
            <FeatureCard
              icon={Video}
              title="HD Video Experience"
              description="Crystal-clear video quality with real-time interaction, making every session feel authentic."
              gradient="from-indigo-500 to-purple-500"
            />
            <FeatureCard
              icon={MessageSquare}
              title="Dynamic Conversations"
              description="AI adapts questions based on your background and responses, creating unique interview scenarios."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={Clock}
              title="Flexible Duration"
              description="Practice sessions up to 30 minutes with automatic timeout handling for optimal experience."
              gradient="from-pink-500 to-red-500"
            />
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="No account required, no data stored. Your privacy is our priority with secure, ephemeral sessions."
              gradient="from-red-500 to-orange-500"
            />
            <FeatureCard
              icon={CheckCircle}
              title="Instant Access"
              description="Start practicing immediately with one click. No downloads, installations, or complex setup required."
              gradient="from-orange-500 to-yellow-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90"></div>
           
            <div className="relative">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Ace Your Next Interview?
              </h3>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands who've improved their interview skills with our AI platform
              </p>
              <button
                onClick={() => setIsStarted(true)}
                className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
              >
                <Video className="w-5 h-5" />
                <span>Begin Interview Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-lg">AI Interview Pro</h4>
                <p className="text-slate-400 text-sm">Powered by Tavus & Daily.co</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2025 AI Interview Pro. Privacy-focused interview practice.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                No data stored • No account required • Secure sessions
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App;