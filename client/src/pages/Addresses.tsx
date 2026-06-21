import { useState } from 'react';

export default function Addresses() {
  const [addr, setAddr] = useState('');
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Addresses</h2>
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <textarea value={addr} onChange={e => setAddr(e.target.value)} placeholder="Address" className="w-full border p-2 rounded" />
        <button className="w-full bg-slate-900 text-white py-2 rounded">Save</button>
      </form>
    </div>
  );
}
