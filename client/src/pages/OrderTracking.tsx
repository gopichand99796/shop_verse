import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orders } from '../services/api';

export default function OrderTracking() {
  const { id } = useParams();
  // placeholder for future: fetch specific order
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order {id}</h2>
      <div className="bg-white p-4 rounded">Tracking information will appear here.</div>
    </div>
  );
}
