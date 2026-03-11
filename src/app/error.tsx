"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí podríamos enviar el error a un servicio como Sentry
    console.error("Error Boundary atrapó un error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        ¡Ups! Algo salió mal
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Tuvimos un problema inesperado al cargar esta página. Estamos
        trabajando para solucionarlo.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-ml-blue text-white font-medium rounded-full hover:bg-blue-600 transition-colors shadow-sm"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-gray-700 font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
