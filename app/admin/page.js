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
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        alert('Failed to load students');
      } else {
        setStudents(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(query)) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.phone && s.phone.toLowerCase().includes(query)) ||
      (s.college && s.college.toLowerCase().includes(query))
    );
  });

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '40px', maxWidth: '400px', margin: '80px auto', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter PIN Passcode"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '15px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{ width: '100%', padding: '10px', fontSize: '16px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Student Registrations Dashboard</h2>
      
      <input
        type="text"
        placeholder="Search by name, email, phone, or college..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>Student ID</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Phone</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>College</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s, idx) => (
                <tr key={s.id || idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{s.id || idx + 1}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.name || '-'}</td>
                  <td style={{ padding: '12px' }}>{s.phone || '-'}</td>
                  <td style={{ padding: '12px' }}>{s.email || '-'}</td>
                  <td style={{ padding: '12px' }}>{s.college || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>
                  No student records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}