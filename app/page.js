'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function StudentRegistration() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Generate a unique student ID like RAM-4821
    const randomId = `RAM-${Math.floor(1000 + Math.random() * 9000)}`;

    const { error } = await supabase
      .from('students')
      .insert([{ 
        student_id: randomId,
        name, 
        phone, 
        email, 
        college_name: college 
      }]);

    setLoading(false);

    if (error) {
      alert('Error saving details: ' + error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Student Registration Form</h2>
      {submitted ? (
        <div style={{ background: '#e6ffed', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Thank you, {name}!</h3>
          <p>Your registration has been successfully submitted.</p>
          <button 
            onClick={() => { setSubmitted(false); setName(''); setPhone(''); setEmail(''); setCollege(''); }} 
            style={{ padding: '10px 20px', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Register Another Student
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
            <input 
              type="tel" 
              required 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>College / Course</label>
            <input 
              type="text" 
              required 
              value={college} 
              onChange={(e) => setCollege(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
          >
            {loading ? 'Submitting...' : 'Register Now'}
          </button>
        </form>
      )}
    </div>
  );
}
