import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Video, Mic, Phone, Loader2, AlertCircle, CheckCircle2, X, Sparkles } from 'lucide-react';

interface InterviewLauncherProps {
  onBack: () => void;
}

interface ConversationResponse {
  conversation_url: string;
  conversation_id: string;
  status: string;
}

const InterviewLauncher: React.FC<InterviewLauncherProps> = ({ onBack }) => {
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: 'This is a professional interview simulation. Please conduct a friendly but professional interview, asking about the candidate\'s background, experience, and career goals. Keep the conversation natural and engaging.'
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: ConversationResponse = await response.json();
      if (data.conversation_url) {
        setMeetingUrl(data.conversation_url);
        setConversationId(data.conversation_id);
      } else {
        throw new Error('No conversation URL received');
      }
    } catch (err) {
      console.error('Error starting interview:', err);
      setError(err instanceof Error ? err.message : 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (conversationId) {
      try {
        await fetch(`/api/conversation/${conversationId}/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (err) {
        console.error('Error ending conversation:', err);
      }
    }
    onBack();
  };

  useEffect(() => {
    startInterview();
    return () => {
      if (conversationId) {
        fetch(`/api/conversation/${conversationId}/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }).catch(console.error);
      }
    };
    // eslint-disable-next-line
  }, []);

  if (loading || !meetingUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              {loading ? (
                <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
              ) : error ? (
                <AlertCircle className="w-12 h-12 text-red-400" />
              ) : (
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              )}
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-blue-400/30 animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {loading ? 'Preparing Your AI Interview' : error ? 'Connection Failed' : 'Ready to Begin'}
          </h2>
          <p className="text-blue-200 mb-8 max-w-md mx-auto">
            {loading 
              ? 'Setting up your personalized AI interviewer. This may take a moment...'
              : error 
                ? 'We encountered an issue connecting to the interview service. Please try again.'
                : 'Your AI interview session is ready to start.'
            }
          </p>
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {error && (
              <button
                onClick={startInterview}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
              >
                <Video className="w-5 h-5" />
                <span>Try Again</span>
              </button>
            )}
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm border border-white/20 flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-slate-800 border-b border-slate-700 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={endInterview}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>End Interview</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Live AI Interview</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
              Connected
            </div>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative">
        <div className="w-full h-full flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-5xl aspect-video bg-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <iframe
              ref={iframeRef}
              src={meetingUrl}
              className="w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] border-0"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              title="AI Interview Session"
            />
            {/* Floating Tips Panel */}
            {showTips && (
              <div className="absolute top-6 left-6 z-30 max-w-xs bg-black/70 backdrop-blur-md rounded-xl p-5 text-white shadow-xl animate-fade-in pointer-events-auto">
                <button
                  className="absolute top-2 right-2 text-white/70 hover:text-white"
                  onClick={() => setShowTips(false)}
                  aria-label="Close tips"
                >
                  <X className="w-4 h-4" />
                </button>
                <h3 className="font-semibold mb-2">Interview Tips:</h3>
                <ul className="text-sm space-y-1 text-white/80">
                  <li>• Speak clearly and maintain eye contact with the camera</li>
                  <li>• Take your time to think before answering</li>
                  <li>• Ask questions about the role and company</li>
                  <li>• Be authentic and let your personality shine</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Footer Controls */}
      <footer className="sticky bottom-0 z-20 bg-slate-800 border-t border-slate-700 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg mb-2">
              <Video className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">Camera Active</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-lg mb-2">
              <Mic className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">Microphone Active</span>
            </div>
            <button
              onClick={endInterview}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mb-2"
            >
              <Phone className="w-4 h-4" />
              <span>End Interview</span>
            </button>
            <button
              onClick={() => setShowTips((v) => !v)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mb-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{showTips ? 'Hide Tips' : 'Show Tips'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InterviewLauncher;