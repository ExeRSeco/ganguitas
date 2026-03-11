import AffiliateButton from "@/components/ui/AffiliateButton";
import ProductCard from "@/components/ui/ProductCard";
import SearchBar from "@/components/ui/SearchBar";
import { Suspense } from "react";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  // Parallel fetching con Promise.all y manejo de errores
  const [
    { data: gangas, error: errorGangas },
    { data: destacadas, error: errorDestacadas },
    { data: virales, error: errorVirales },
    { data: recomendado, error: errorRecomendado }
  ] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }).limit(4),
    supabase.from('products').select('*').eq('destacado', true).limit(3),
    supabase.from('products').select('*').order('views', { ascending: false }).limit(4),
    supabase.from('products').select('*').eq('recomendado', true).order('created_at', { ascending: false }).limit(1).maybeSingle()
  ]);

  if (errorGangas || errorDestacadas || errorVirales || errorRecomendado) {
    console.error("[Homepage] Error fetching data:", { errorGangas, errorDestacadas, errorVirales, errorRecomendado });
  }

  // Combinar productos para el Schema ItemList (sólo los más relevantes de la home)
  const allHighlightedProducts = [
    ...(destacadas || []),
    ...(gangas || []),
  ].slice(0, 10); // Límite razonable

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": allHighlightedProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.titulo,
        "image": product.imagen,
        "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ganguitas.com'}/producto/${product.slug}`,
        "description": product.descripcion || product.titulo,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "ARS",
          "price": product.precio
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Section */}
      <section className="bg-ml-yellow px-4 py-10 md:pt-16 md:pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 leading-tight">
            Las cosas que sí valen la pena comprar
          </h1>
          <p className="text-base md:text-lg text-gray-800 mb-6 md:mb-8 max-w-xl mx-auto px-2">
            Productos útiles, ofertas reales y hallazgos de Mercado Libre recomendados para ti.
          </p>
          <div className="max-w-[280px] md:max-w-xs mx-auto">
            <AffiliateButton href="#gangas" className="text-base md:text-lg shadow-sm bg-ml-blue text-white hover:bg-blue-600">
              Ver gangas de hoy
            </AffiliateButton>
          </div>
        </div>
      </section>
      {/* Buscador y Categorías Simples */}
      <section id="categorias" className="max-w-5xl mx-auto px-4 mt-8 md:mt-12 mb-8 md:mb-12">
        <Suspense fallback={<div className="h-14 w-full max-w-2xl mx-auto mb-6 bg-gray-100 animate-pulse rounded-full"></div>}>
          <div className="max-w-2xl mx-auto relative z-10 -mt-14 md:-mt-18 shadow-lg rounded-full">
            <SearchBar />
          </div>
        </Suspense>

        {/* Carrusel horizontal táctil para categorías */}
        <div className="mt-8 flex overflow-x-auto gap-2 md:gap-3 justify-start sm:justify-center pb-4 hide-scrollbar px-1 snap-x">
          {['Herramientas', 'Hogar', 'Tecnología', 'Auto', 'Ofertas'].map((cat) => (
            <Link key={cat} href={`/categoria/${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="shrink-0 snap-start px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados (Reemplazando Productos del Video) */}
      {destacadas && destacadas.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-10 md:mb-16">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900 flex items-center gap-2">
              Productos Destacados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {destacadas.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  titulo={product.titulo}
                  imagen={product.imagen}
                  precio_regular={product.precio_regular || undefined}
                  precio={product.precio}
                  link_afiliado={product.link_afiliado}
                  destacado={product.destacado}
                  slug={product.slug}
                  pros={product.pros}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Gangas del día (Desde la DB) */}
      {gangas && gangas.length > 0 && (
        <section id="gangas" className="max-w-5xl mx-auto px-4 mb-10 md:mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 flex items-center gap-2">
            Gangas de hoy
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {gangas.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                titulo={product.titulo}
                imagen={product.imagen}
                precio_regular={product.precio_regular || undefined}
                precio={product.precio}
                link_afiliado={product.link_afiliado}
                slug={product.slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Productos Virales (Más de clicks/views) */}
      {virales && virales.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-10 md:mb-16">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 flex items-center gap-2">
            Productos Virales
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {virales.map((product) => (
              <ProductCard
                key={`viral-${product.id}`}
                id={product.id}
                titulo={product.titulo}
                imagen={product.imagen}
                precio_regular={product.precio_regular || undefined}
                precio={product.precio}
                link_afiliado={product.link_afiliado}
                slug={product.slug}
                destacado={true} // Forzamos mostrar badge si así quisiéramos
                pros={product.pros}
              />
            ))}
          </div>
        </section>
      )}


      {/* 6. Producto Destacado / Recomendado de la Semana */}
      {recomendado && (
        <section className="bg-white border-y border-gray-200 py-8 md:py-16 mb-10 md:mb-16">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-5 md:gap-8 items-center">
            <Link href={`/producto/${recomendado.slug}`} className="relative w-full md:w-1/2 bg-gray-50 aspect-square rounded-lg flex items-center justify-center p-4 hover:opacity-90 transition-opacity mx-4 md:mx-0 border border-gray-100 overflow-hidden">
              {recomendado.imagen.startsWith('http') || recomendado.imagen.startsWith('/') ? (
                <img src={recomendado.imagen} alt={recomendado.titulo} className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-400 text-sm md:text-base">[ Imagen Destacado ]</span>
              )}
            </Link>
            <div className="w-full md:w-1/2 px-2 md:px-0">
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                🌟 Recomendación de la semana
              </span>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
                <Link href={`/producto/${recomendado.slug}`} className="hover:text-blue-600 transition-colors">
                  {recomendado.titulo}
                </Link>
              </h2>
              <div className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2 md:gap-3">
                ${recomendado.precio.toLocaleString('es-AR')}
                {recomendado.precio_regular && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    {Math.round(((recomendado.precio_regular - recomendado.precio) / recomendado.precio_regular) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6 md:mb-8 text-sm md:text-base">
                {recomendado.pros && recomendado.pros.length > 0 ? (
                  recomendado.pros.map((pro: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="text-indigo-500 font-bold mt-0.5 shrink-0">✓</span>
                      <p className="text-gray-700">{pro}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3">
                    <span className="text-indigo-500 font-bold mt-0.5 shrink-0">ℹ️</span>
                    <p className="text-gray-700"><strong>Por qué vale la pena:</strong> {recomendado.descripcion || "Un excelente producto con gran relación calidad-precio ideal para añadir a tu rutina diaria."}</p>
                  </div>
                )}
              </div>

              <div className="max-w-sm">
                <AffiliateButton href={recomendado.link_afiliado} className="text-lg py-4 shadow-sm" variant="blue">
                  COMPRAR AHORA
                </AffiliateButton>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. CTA Final */}
      <section className="text-center px-4 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Buscás más cosas que valgan la pena?</h2>
        <p className="text-lg text-gray-600 mb-8">Navegá por nuestra colección completa de hallazgos recomendados.</p>
        <div className="max-w-xs mx-auto">
          <AffiliateButton href="#gangas" variant="yellow" className="text-lg border-2 border-transparent hover:border-gray-900">
            Explorá todas las gangas
          </AffiliateButton>
        </div>
      </section>

    </div>
  );
}
