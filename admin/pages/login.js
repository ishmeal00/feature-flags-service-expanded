import axios from 'axios';
import { useState } from 'react';
import Router from 'next/router';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function submit(e) {
    e.preventDefault();
    try {
      // send credentials to backend; backend will set httpOnly refresh cookie
      const res = await axios.post('/api/auth/login-cookie', { email, password }, { withCredentials: true });
      // store short-lived token in memory/localStorage if provided
      if (res.data?.token) localStorage.setItem('token', res.data.token);
      Router.push('/flags');
    } catch (e) {
      console.error(e);
      alert('Login failed');
    }
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button>Login</button>
      </form>
    </div>
  )
}
