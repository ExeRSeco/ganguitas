"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  titulo: string;
  imagenes: string[];
}

export default function ProductGallery({ titulo, imagenes }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(imagenes[0]);

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      {/* 1. Imagen Grande Seleccionada */}
      <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center rounded-md border border-gray-100 overflow-hidden">
        {mainImage?.startsWith('http') || mainImage?.startsWith('/') ? (
           <Image src={mainImage} alt={titulo} fill className="object-contain p-4" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
             [ Imagen del Producto ]
          </div>
        )}
      </div>
      
      {/* 2. Galería de miniaturas (sólo si hay más de 1 imagen) */}
      {imagenes.length > 1 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {imagenes.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setMainImage(img)}
              className={`relative w-16 h-16 bg-gray-50 rounded border cursor-pointer hover:border-ml-blue overflow-hidden transition-all ${
                mainImage === img ? 'border-ml-blue ring-2 ring-blue-100 opacity-100' : 'border-gray-200 opacity-60 hover:opacity-100'
              }`}
            >
              {img?.startsWith('http') || img?.startsWith('/') ? (
                <Image src={img} alt={`${titulo} ${i + 1}`} fill className="object-cover" />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
