'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome back. Let us start Day 1 practice. Please introduce yourself. Tell me your name, your background, and your city.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timer, setTimer] = useState(3600); // 60 mins
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || !isTimerRunning) return;

    const userMsg = inputMessage;
    setInputMessage('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/ram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, currentDay: 1 })
      });
      const data = await res.json();
      
      if (data.reply) {
        const updatedMessages = [...newMessages, { role: 'assistant', content: data.reply }];
        setMessages(updatedMessages);

        // Speak response out loud
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.reply);
          utterance.lang = 'en-IN';
          window.speechSynthesis.speak(utterance);
        }
      } else if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: `Error: ${data.error}` }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Network error connecting to RAM.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleListen = () => {
    if (!isTimerRunning) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '650px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px', display: 'flex', flexDirection: 'column', height: '80vh' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1f2937' }}>Welcome, Ashish Kelkar!</h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0' }}>Student ID: RAM-3732</p>
          </div>
          <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>TRIAL ACCESS</span>
        </div>

        {/* Status & Timer Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: 'bold' }}>CURRENT LESSON</p>
            <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: 'bold', margin: '0' }}>DAY 1 / 30</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px 0', fontWeight: 'bold' }}>DAILY PRACTICE USAGE</p>
            <p style={{ fontSize: '14px', color: '#2563eb', fontWeight: 'bold', margin: '0' }}>{formatTime(timer)} / 60:00</p>
          </div>
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)} 
            style={{ backgroundColor: isTimerRunning ? '#dc2626' : '#16a34a', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
          </button>
        </div>

        {/* Chat Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', backgroundColor: msg.role === 'user' ? '#2563eb' : '#f3f4f6', color: msg.role === 'user' ? '#ffffff' : '#1f2937', padding: '10px 14px', borderRadius: '12px', fontSize: '14px' }}>
              {msg.content}
            </div>
          ))}
          {loading && <div style={{ alignSelf: 'flex-start', color: '#6b7280', fontSize: '13px', fontStyle: 'italic' }}>RAM is typing...</div>}
          <div ref={chatEndRef} />
        </div>

        {/* Input & Control Box */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={!isTimerRunning}
            placeholder={isTimerRunning ? "Type or click Speak..." : "Resume timer to continue practice..."}
            style={{ 
              flex: 1, 
              padding: '10px 14px', 
              border: '1px solid #d1d5db', 
              borderRadius: '8px', 
              fontSize: '14px', 
              outline: 'none', 
              backgroundColor: isTimerRunning ? '#ffffff' : '#f3f4f6', 
              color: isTimerRunning ? '#1f2937' : '#9ca3af',
              cursor: isTimerRunning ? 'text' : 'not-allowed' 
            }}
          />
          <button
            onClick={handleListen}
            disabled={!isTimerRunning}
            style={{ 
              backgroundColor: !isTimerRunning ? '#9ca3af' : (isListening ? '#dc2626' : '#16a34a'), 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 16px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: isTimerRunning ? 'pointer' : 'not-allowed', 
              opacity: isTimerRunning ? 1 : 0.6 
            }}
          >
            {isListening ? 'Stop' : 'Speak'}
          </button>
          <button
            onClick={handleSend}
            disabled={!isTimerRunning}
            style={{ 
              backgroundColor: !isTimerRunning ? '#9ca3af' : '#2563eb', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 18px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: isTimerRunning ? 'pointer' : 'not-allowed', 
              opacity: isTimerRunning ? 1 : 0.6 
            }}
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
