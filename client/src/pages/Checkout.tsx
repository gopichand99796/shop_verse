import { useState } from 'react';
import { orders } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [address, setAddress] = useState('');
  const nav = useNavigate();

  const submit = async (e: any) => {
    e.preventDefault();
    try { await orders.create({ shippingAddress: address }); nav('/orders'); } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
      <form onSubmit={submit} className="space-y-3">
        <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Shipping address" className="w-full border p-2 rounded" />
        <button className="w-full bg-slate-900 text-white py-2 rounded">Place order</button>
      </form>
    </div>
  );
}
