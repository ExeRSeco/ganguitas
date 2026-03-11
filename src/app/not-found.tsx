import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-ml-blue text-9xl font-extrabold opacity-20 mb-[-40px]">
        404
      </div>
      <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 z-10">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4 z-10">
        Página no encontrada
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto z-10">
        Parece que el producto o la página que buscas no existe o fue movida a
        otra dirección.
      </p>

      <div className="z-10">
        <Link
          href="/"
          className="px-8 py-3 bg-ml-blue text-white font-medium rounded-full hover:bg-blue-600 transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Explorar gangas de hoy
        </Link>
      </div>
    </div>
  );
}
