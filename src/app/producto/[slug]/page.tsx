import AffiliateButton from "@/components/ui/AffiliateButton";
import ProductBadge from "@/components/ui/ProductBadge";
import ProductCard from "@/components/ui/ProductCard";
import ProductGallery from "@/components/ui/ProductGallery";
import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type Props = {
  params: Promise<{ slug: string }>
};

const getProduct = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('*').eq('slug', slug).single();
  return product;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return { title: 'Producto no encontrado | Ganguitas' }
  }
  
  return {
    title: `${product.titulo} | Ganguitas`,
    description: product.descripcion?.slice(0, 160) || `Encuentra la mejor oferta para ${product.titulo}.`,
    openGraph: {
      title: `${product.titulo} | Las Mejores Ofertas`,
      description: product.descripcion?.slice(0, 160) || `Aprovecha el descuento en ${product.titulo}.`,
      images: [product.imagen],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Obtener producto optimizado en caché reactiva
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  // Incrementar vistas en la base de datos "Background task"
  supabase.rpc('increment_views', { product_id: product.id }).then(({ error }) => {
    if (error) console.error("Error incrementing views:", error);
  });

  // Obtener productos relacionados de la misma categoría (Excluir el actual, limite 3)
  const { data: related } = await supabase.from('products')
    .select('*')
    .eq('categoria', product.categoria)
    .neq('id', product.id)
    .limit(3);

  const discount = product.precio_regular ? Math.round(((product.precio_regular - product.precio) / product.precio_regular) * 100) : 0;
  const badge = product.destacado ? 'recomendado' : (discount > 0 ? 'oferta' : undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.titulo,
    "image": product.imagenes?.length > 0 ? product.imagenes : [product.imagen],
    "description": product.descripcion || `Oferta en ${product.titulo}`,
    "brand": {
      "@type": "Brand",
      "name": "Mercado Libre"
    },
    "category": product.categoria || "Other",
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ganguitas.com'}/producto/${product.slug}`,
      "priceCurrency": "ARS",
      "price": product.precio,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Mercado Libre"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": product.views > 0 ? product.views : 15
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-28 md:pb-20 pt-4 md:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-0 sm:px-4">
        
        <nav className="flex text-sm text-gray-500 mb-6 px-4 sm:px-0">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/categoria/${product.categoria || 'todas'}`} className="hover:text-blue-600 capitalize">{product.categoria || 'Categoría'}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 truncate">{product.titulo}</span>
        </nav>

        <div className="bg-white sm:rounded-lg shadow-sm sm:border border-gray-100 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12">
          
          {/* 1. Galería de Imágenes */}
          <ProductGallery 
            titulo={product.titulo} 
            imagenes={product.imagenes && product.imagenes.length > 0 ? product.imagenes : [product.imagen]} 
          />

          {/* Detalles del Producto */}
          <div className="w-full md:w-1/2 flex flex-col">
            
            {/* Etiquetas y Contadores Reales */}
            <div className="mb-3 flex flex-wrap gap-3 items-center">
              {badge && <ProductBadge type={badge as 'oferta' | 'recomendado'} />}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-md">
                🔥 {product.views || 0} personas vieron esto
              </div>
            </div>

            {/* 2. Título */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              {product.titulo}
            </h1>

            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="flex text-ml-blue gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-4 h-4 ${star <= 5 ? 'text-ml-blue' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">5.0</span>
            </div>

            {/* 3. Precio */}
            <div className="mb-6 md:mb-8">
              {product.precio_regular && (
                <p className="text-xs md:text-sm text-gray-400 line-through mb-1">
                  ${product.precio_regular.toLocaleString('es-AR')}
                </p>
              )}
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-3xl md:text-4xl tracking-tight font-light text-gray-900">
                  ${product.precio.toLocaleString('es-AR')}
                </span>
                {discount > 0 && (
                  <span className="text-base md:text-lg font-medium text-green-600">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 font-medium mt-2">Envío gratis disponible</p>
            </div>

            {/* 4. Por qué vale la pena (Pros) */}
            {product.pros && product.pros.length > 0 && (
              <div className="mb-6 md:mb-8 bg-green-50 rounded-lg p-4 md:p-5 border border-green-100">
                <h3 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                  <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">👍</span>
                  Por qué vale la pena
                </h3>
                <ul className="space-y-2">
                  {product.pros.map((pro: string, idx: number) => (
                    <li key={idx} className="flex gap-2.5 items-start text-gray-700 text-sm md:text-base">
                      <span className="text-green-600 font-bold shrink-0">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Descripción */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Acerca de este producto</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.descripcion}
              </p>
            </div>

            {/* 5. Botón afiliado (Sticky en Celulares) */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 md:static md:bg-transparent md:border-none md:shadow-none md:p-0 md:mt-auto md:mb-8">
              <AffiliateButton productId={product.id} href={product.link_afiliado} variant="blue" className="text-base md:text-xl py-3.5 md:py-4 shadow-sm hover:shadow-md w-full font-bold">
                VER OFERTA EN MERCADO LIBRE
              </AffiliateButton>
            </div>

            {/* 6. Beneficio Ganguitas */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 md:p-5 mt-2 relative">
              <div className="absolute -top-3 left-4 md:left-5 bg-orange-100 text-orange-800 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Transparencia
              </div>
              <h3 className="font-bold text-gray-900 mb-2 mt-2 md:mt-1">Ganguitas</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Revisamos regularmente estos precios para asegurarnos de que la oferta siga valiendo la pena. 
                Si ves algún problema, háznoslo saber. No pagamos de más ni dejas de pagar menos por usar nuestros enlaces.
              </p>
            </div>

          </div>
        </div>

        {/* 7. Productos Relacionados */}
        {related && related.length > 0 && (
          <div className="mt-10 md:mt-16 px-4 sm:px-0">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">También te puede interesar</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {related.map(prod => (
                <ProductCard 
                  key={prod.id}
                  id={prod.id}
                  titulo={prod.titulo}
                  imagen={prod.imagen}
                  precio_regular={prod.precio_regular || undefined}
                  precio={prod.precio}
                  link_afiliado={prod.link_afiliado}
                  destacado={prod.destacado}
                  slug={prod.slug}
                  pros={prod.pros}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
