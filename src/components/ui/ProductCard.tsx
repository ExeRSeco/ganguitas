import Image from 'next/image';
import Link from 'next/link';
import AffiliateButton from './AffiliateButton';
import ProductBadge, { BadgeType } from './ProductBadge';

interface ProductCardProps {
  id?: string;
  titulo: string;
  imagen: string;
  precio: number;
  precio_regular?: number; // Opcional, mantendré la lógica de dto si existe
  rating?: number;
  link_afiliado: string;
  destacado?: boolean;
  slug?: string;
  pros?: string[];
}

export default function ProductCard({ id, titulo, imagen, precio_regular, precio, rating, link_afiliado, destacado, slug, pros }: ProductCardProps) {
  const discount = precio_regular ? Math.round(((precio_regular - precio) / precio_regular) * 100) : 0;
  const productSlug = slug || titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const badge = destacado ? 'recomendado' : (discount > 0 ? 'oferta' : undefined);

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <Link href={`/producto/${productSlug}`} className="relative aspect-square w-full bg-gray-50 flex items-center justify-center p-3 sm:p-4 cursor-pointer group">
        {badge && (
          <div className="absolute top-2 left-2 z-10">
            <ProductBadge type={badge} />
          </div>
        )}
        <div className="relative w-full h-full">
          {/* Usamos un div como placeholder si no hay URL real */}
          {imagen.startsWith('http') || imagen.startsWith('/') ? (
             <Image src={imagen} alt={titulo} fill className="object-contain" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-sm text-gray-400 text-xs sm:text-sm">
              [ Imagen ]
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <Link href={`/producto/${productSlug}`} className="hover:text-blue-600 transition-colors">
          <h3 className="text-xs sm:text-sm text-gray-700 font-medium line-clamp-2 md:line-clamp-3 mb-2 group-hover:text-blue-600 leading-snug sm:leading-normal">{titulo}</h3>
        </Link>
        
        {pros && pros.length > 0 && (
          <ul className="mb-2 space-y-0.5">
             {pros.slice(0, 2).map((pro, i) => (
               <li key={i} className="flex gap-1.5 items-start text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                 <span className="text-green-500 font-bold shrink-0">✓</span>
                 <span className="truncate">{pro}</span>
               </li>
             ))}
          </ul>
        )}
        
        <div className="mt-auto">
          {precio_regular && (
            <p className="text-[10px] sm:text-xs text-gray-400 line-through mb-0.5">
              ${precio_regular.toLocaleString('es-AR')}
            </p>
          )}
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-lg sm:text-2xl font-semibold text-gray-900 leading-none">
              ${precio.toLocaleString('es-AR')}
            </span>
            {discount > 0 && (
              <span className="text-[10px] sm:text-sm font-medium text-green-600">
                {discount}% OFF
              </span>
            )}
          </div>

          {rating && (
            <div className="flex items-center gap-1 mb-3 sm:mb-4 hidden sm:flex">
              <svg className="w-3.5 h-3.5 text-ml-blue" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
              </svg>
              <span className="text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
          
          <AffiliateButton href={link_afiliado} productId={id} variant="blue" className="text-[10px] sm:text-xs py-2 sm:py-2.5 px-2">
            <span className="hidden sm:inline">VER EN MERCADO LIBRE</span>
            <span className="sm:hidden">VER OFERTA</span>
          </AffiliateButton>
        </div>
      </div>
    </div>
  );
}
