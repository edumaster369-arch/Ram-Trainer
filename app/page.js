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
        