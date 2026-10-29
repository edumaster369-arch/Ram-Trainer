'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste! I am RAM Trainer. Click Resume Timer to start practicing your English fluency.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Student & Syllabus States
  const [studentName, setStudentName] = useState('Ashish Kelkar');
  const [studentId, setStudentId] = useState('RAM-3732');
  const [currentDay, setCurrentDay] = useState(1);
  
  // Continuous Timer States (in seconds)
  const [seconds, setSeconds] = useState(247);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Timer Interval Logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 3600) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            return 3600;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Text-to-Speech (RAM speaks out loud)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN'; // Indian English accent
      utterance.rate = 0.95; // Natural speaking pace
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-Text (Student speaks into microphone)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInput(speechToText);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, currentDay: currentDay }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
        speakText(data.reply); // Automatically read RAM's response aloud
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: `Error: ${data.error}` }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Network connection error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#111827' }}>Welcome, {studentName}!</h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Student ID: {studentId}</p>
          </div>
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            TRIAL ACCESS
          </span>
        </div>

        {/* Status Bar: Day Display & Resumable Timer */}
        <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', letterSpacing: '0.5px' }}>CURRENT LESSON</span>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>DAY {currentDay} / 30</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', letterSpacing: '0.5px' }}>DAILY PRACTICE USAGE</span>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1d4ed8' }}>{formatTime(seconds)} / 60:00</div>
          </div>
          <button 
            onClick={toggleTimer} 
            style={{ backgroundColor: isTimerRunning ? '#dc2626' : '#16a34a', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
            {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          </button>
        </div>

        {/* Chat Area */}
        <div style={{ height: '320px', overflowY: 'auto', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', backgroundColor: msg.role === 'user' ? '#2563eb' : '#f3f4f6', color: msg.role === 'user' ? '#ffffff' : '#1f2937', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.4' }}>
                {msg.text}
              </div>
              {msg.role === 'assistant' && (
                <button 
                  onClick={() => speakText(msg.text)} 
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', cursor: 'pointer', marginTop: '4px', padding: 0 }}>
                  🔊 Listen Again
                </button>
              )}
            </div>
          ))}
          {loading && <div style={{ alignSelf: 'flex-start', color: '#9ca3af', fontSize: '13px' }}>RAM Trainer is typing...</div>}
        </div>

        {/* Input & Voice Controls Bar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening... Speak now..." : "Type or click Speak..."} 
            style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
          />
          <button 
            onClick={startListening} 
            style={{ backgroundColor: isListening ? '#dc2626' : '#16a34a', color: '#ffffff', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isListening ? '🛑 Stop' : '🎙️ Speak'}
          </button>
          <button onClick={handleSend} style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}