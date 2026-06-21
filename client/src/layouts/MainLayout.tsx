import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-6"> 
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">© ShopVerse</div>
      </footer>
    </div>
  );
}
