import Link from 'next/link';
import { TrendingUp, Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-ml-yellow w-full sticky top-0 z-50 border-b border-ml-yellow-dark">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl sm:text-2xl font-extrabold text-[#2d3277] tracking-tight">
            Ganguitas
          </span>
        </Link>

        {/* Links y Admin */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-gray-800">
          <Link href="/productos-virales" className="flex items-center gap-1 hover:text-black transition-colors whitespace-nowrap">
            <TrendingUp className="w-4 h-4 text-purple-600" /> Virales
          </Link>
          <Link href="/gadgets-utiles" className="flex items-center gap-1 hover:text-black transition-colors whitespace-nowrap">
            <Cpu className="w-4 h-4 text-blue-500" /> Gadgets
          </Link>
          <Link href="/#gangas" className="hover:text-black transition-colors whitespace-nowrap hidden sm:inline-block">Ofertas</Link>
          <Link href="/#categorias" className="hover:text-black transition-colors whitespace-nowrap hidden sm:inline-block">Categorías</Link>
          
          {/* Admin Icon */}
          <Link href="/admin" className="text-gray-800 hover:text-black transition-colors p-1.5 sm:p-2 rounded-full hover:bg-black/5" aria-label="Admin Dashboard">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2d3277]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
