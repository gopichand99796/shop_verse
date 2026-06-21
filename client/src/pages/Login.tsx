import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../store/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuth((s) => s.login);
  const nav = useNavigate();

  const handle = async (e: any) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handle} className="space-y-3">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border p-2 rounded" />
        <button className="w-full bg-slate-900 text-white py-2 rounded">Sign in</button>
      </form>
    </div>
  );
}
