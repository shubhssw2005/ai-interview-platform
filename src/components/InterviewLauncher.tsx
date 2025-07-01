import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Video, Mic, Phone, Loader2, AlertCircle, CheckCircle2, X, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

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
  const apiBase = import.meta.env.VITE_API_URL || '';
  const [captions, setCaptions] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [cameraOn, setCameraOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveAICaption, setLiveAICaption] = useState('');
  const [tavusStatus, setTavusStatus] = useState<'waiting' | 'receiving'>('waiting');
  const [liveUserCaption, setLiveUserCaption] = useState('');

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiBase}/api/create-conversation`, {
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
        await fetch(`${apiBase}/api/conversation/${conversationId}/end`, {
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
        fetch(`${apiBase}/api/conversation/${conversationId}/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }).catch(console.error);
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.event && event.data.event === 'app-message') {
        const msg = event.data;
        if (msg.data && msg.data.role === 'assistant' && msg.data.content) {
          setTavusStatus('receiving');
          setLiveAICaption(msg.data.content);
          setCaptions((prev) => [...prev.slice(-8), { role: 'assistant', content: msg.data.content }]);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Browser SpeechRecognition for user mic captions
  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLiveUserCaption('SpeechRecognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setLiveUserCaption(interim);
      if (final) {
        setCaptions((prev) => [...prev.slice(-8), { role: 'user', content: final }]);
      }
    };

    recognition.onerror = (event: any) => {
      setLiveUserCaption('Speech recognition error: ' + event.error);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  const handleCameraToggle = () => setCameraOn((on) => !on);

  const handleFullscreen = () => {
    setIsFullscreen((v) => !v);
    const elem = document.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

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
    <div className={`min-h-screen bg-gradient-to-br from-black via-slate-900 to-indigo-950 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Main Video Area - Cinematic Fullscreen */}
      <main className="flex-1 flex flex-col items-center justify-center relative">
        <div className="w-full h-full flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-7xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_80px_10px_rgba(0,0,0,0.7)]"
            style={{ minHeight: '40vw', maxHeight: '90vh' }}>
            <iframe
              ref={iframeRef}
              src={meetingUrl}
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              title="AI Interview Session"
              style={{ background: 'black' }}
            />
            {/* Overlay Controls - Responsive */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <button onClick={handleFullscreen} className="p-2 bg-black/60 rounded-full hover:bg-black/80 text-white shadow-lg" aria-label="Toggle Fullscreen">
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button onClick={endInterview} className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white shadow-lg" aria-label="End Interview">
                <Phone className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-4 left-4 flex gap-2 z-20">
              <button
                onClick={handleCameraToggle}
                className={`p-2 rounded-full shadow-lg ${cameraOn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                aria-label={cameraOn ? 'Camera On' : 'Camera Off'}
                data-tooltip-id="camera-tooltip"
                data-tooltip-content="Camera control is managed by the AI interview system."
              >
                <Video className="w-5 h-5" />
              </button>
              <Tooltip id="camera-tooltip" />
            </div>
            {/* Status indicators for debugging */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-4 pointer-events-none">
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${tavusStatus === 'receiving' ? 'bg-green-700 text-white' : 'bg-yellow-600 text-white'}`}>AI: {tavusStatus}</div>
            </div>
            {/* Live Caption Bar - Responsive */}
            {((captions.length > 0 && captions.some(c => c.content && c.content.trim())) || liveUserCaption || liveAICaption) ? (
              <div className="absolute bottom-0 left-0 w-full z-30 flex flex-col items-center pointer-events-none px-2 pb-2 gap-1">
                {[...captions.slice(-2)].filter(cap => cap.content && cap.content.trim()).map((cap, i) => (
                  <div
                    key={i}
                    className={`w-full max-w-4xl bg-black/80 text-lg md:text-2xl font-semibold rounded-t-2xl px-2 md:px-8 py-2 md:py-4 mb-0 shadow-2xl text-center animate-fade-in overflow-x-auto whitespace-nowrap break-keep ${cap.role === 'user' ? 'text-blue-200' : 'text-green-200'}`}
                    style={{ marginBottom: i === 0 ? 0 : 4 }}
                  >
                    <span className="font-bold mr-2">{cap.role === 'user' ? 'You:' : 'AI:'}</span> {cap.content}
                  </div>
                ))}
                {liveUserCaption && (
                  <div className="w-full max-w-4xl bg-black/80 text-lg md:text-2xl font-semibold rounded-t-2xl px-2 md:px-8 py-2 md:py-4 mb-0 shadow-2xl text-center animate-fade-in overflow-x-auto whitespace-nowrap break-keep text-blue-200">
                    <span className="font-bold mr-2">You:</span> {liveUserCaption}
                  </div>
                )}
                {liveAICaption && <div className="w-full max-w-4xl bg-black/80 text-lg md:text-2xl font-semibold rounded-t-2xl px-2 md:px-8 py-2 md:py-4 mb-0 shadow-2xl text-center animate-fade-in overflow-x-auto whitespace-pre-line break-words text-green-200"><span className="font-bold mr-2">AI:</span> {liveAICaption}</div>}
              </div>
            ) : (
              <div className="absolute bottom-0 left-0 w-full z-30 flex flex-col items-center pointer-events-none px-2 pb-2 gap-1">
                <div className="w-full max-w-4xl bg-black/80 text-lg md:text-2xl font-semibold rounded-t-2xl px-2 md:px-8 py-2 md:py-4 mb-0 shadow-2xl text-center animate-fade-in overflow-x-auto whitespace-pre-line break-words text-yellow-200">
                  {'Waiting for user or AI captions...'}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Optionally, add tips or other overlays here */}
    </div>
  );
};

export default InterviewLauncher;