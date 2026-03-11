"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push(`/buscar`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 group-focus-within:text-ml-blue transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input 
          type="search" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-4 pl-12 text-sm text-gray-900 border border-gray-200 rounded-full bg-white outline-none focus:ring-2 focus:ring-ml-blue/20 focus:border-ml-blue shadow-sm transition-all placeholder-gray-400" 
          placeholder="Buscar marcas, productos y más gangas..." 
        />
        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-ml-blue hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2 transition-colors">
          Buscar
        </button>
      </form>
    </div>
  );
}
