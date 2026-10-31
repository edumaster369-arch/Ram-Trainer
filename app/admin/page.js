'use client';

import { useState } from 'react';
import { supabase } from './supabase';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Secret PIN passcode
  const SECRET_PIN = '7876';

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinCode === SECRET_PIN) {
      setIsAuthenticated(true);
      fetchStudents();
    } else {
      alert('Incorrect Passcode!');
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      console.error('Supabase fetch error:', error);
      alert('Failed to load students: ' + error.message);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Admin Access</h2>
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <input
            type="password"
            placeholder="Enter 4-digit PIN"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            style={{ padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', width: '100%', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone?.includes(searchQuery) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Student Registrations Dashboard</h1>
        <button 
          onClick={fetchStudents} 
          style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Refresh Data
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, phone, or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Phone</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>College / Organization</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No student records found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, idx) => (
                <tr key={s.sr_no || s.student_id || idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{s.student_id || idx + 1}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.name}</td>
                  <td style={{ padding: '12px' }}>{s.phone}</td>
                  <td style={{ padding: '12px' }}>{s.email}</td>
                  <td style={{ padding: '12px' }}>{s.college_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}