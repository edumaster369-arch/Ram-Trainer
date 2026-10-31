'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    college_name: ''
  });

  // Check if student has already registered on this device
  useEffect(() => {
    const savedStudent = localStorage.getItem('ram_student');
    if (savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
  }, []);

  // Handle New Student Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Generate unique Student ID (e.g., RAM-4821)
    const generatedId = 'RAM-' + Math.floor(1000 + Math.random() * 9000);
    
    const newStudent = {
      student_id: generatedId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      college_name: formData.college_name,
      status: 'Trial'
    };

    try {
      // 1. Insert into Supabase 'students' table
      const { error } = await supabase.from('students').insert([newStudent]);

      if (error) {
        alert('Error saving registration: ' + error.message);
        setLoading(false);
        return;
      }

      // 2. Save locally so returning students stay logged in
      localStorage.setItem('ram_student', JSON.stringify(newStudent));
      setStudent(newStudent);
    } catch (err) {
      alert('Registration failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // VIEW 1: REGISTRATION FORM (Shown to new students)
  // ---------------------------------------------------------------------------
  if (!student) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '20px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
              RAM — AI English Trainer
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Register for your 7-Day Free Trial
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. student@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                College / Institute Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zeal College"
                value={formData.college_name}
                onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '600',
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Registering...' : 'Start Free Trial'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW 2: DYNAMIC PRACTICE DASHBOARD (Shown after registration)
  // ---------------------------------------------------------------------------
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#111827' }}>
              Welcome, {student.name}!
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Student ID: {student.student_id}
            </p>
          </div>
          <span style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            fontSize: '12px',
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '12px'
          }}>
            TRIAL ACCESS
          </span>
        </div>

        {/* Status Bar */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <div>
            <span style={{ display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>CURRENT LESSON</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb' }}>DAY 1 / 30</span>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>DAILY PRACTICE USAGE</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb' }}>59:56 / 60:00</span>
          </div>

          <button
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            style={{
              backgroundColor: isTimerPaused ? '#16a34a' : '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
          </button>
        </div>

        {/* Practice Chat Box */}
        <div style={{
          height: '250px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          backgroundColor: '#fafafa',
          overflowY: 'auto'
        }}>
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '12px 16px',
            borderRadius: '12px',
            maxWidth: '85%',
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.4'
          }}>
            Welcome back. Let us start Day 1 practice. Please introduce yourself. Tell me your name, your background, and your city.
          </div>
        </div>

        {/* Controls Bar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Type or click Speak..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px'
            }}
          />
          <button style={{
            backgroundColor: '#16a34a',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Speak
          </button>
          <button style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}