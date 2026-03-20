import AffiliateButton from "@/components/ui/AffiliateButton";
import ProductCard from "@/components/ui/ProductCard";
import SearchBar from "@/components/ui/SearchBar";
import { Suspense } from "react";
import Link from 'next/link';
import Script from 'next/script';
import { createClient } from '@/utils/supabase/server';
import { Sparkles, Flame, Star, Check, Info, Laptop, Home as HomeIcon, Wrench, Car, Zap, TrendingUp } from 'lucide-react';
import type { Product } from '@/types/product';

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'ofertas': return <div className="p-2 bg-red-50 text-red-500 rounded-xl shadow-sm border border-red-100"><Flame className="w-5 h-5 md:w-6 md:h-6" /></div>;
    case 'tecnologia': return <div className="p-2 bg-blue-50 text-blue-500 rounded-xl shadow-sm border border-blue-100"><Laptop className="w-5 h-5 md:w-6 md:h-6" /></div>;
    case 'hogar': return <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl shadow-sm border border-emerald-100"><HomeIcon className="w-5 h-5 md:w-6 md:h-6" /></div>;
    case 'herramientas': return <div className="p-2 bg-orange-50 text-orange-500 rounded-xl shadow-sm border border-orange-100"><Wrench className="w-5 h-5 md:w-6 md:h-6" /></div>;
    case 'auto': return <div className="p-2 bg-slate-100 text-slate-600 rounded-xl shadow-sm border border-slate-200"><Car className="w-5 h-5 md:w-6 md:h-6" /></div>;
    default: return <div className="p-2 bg-gray-50 text-gray-600 rounded-xl shadow-sm border border-gray-200"><Zap className="w-5 h-5 md:w-6 md:h-6" /></div>;
  }
};

export default async function Home() {
  const supabase = await createClient();

  // Categorías a mostrar en la home
  const categoriesToFetch = [
    { id: 'ofertas', name: 'Ofertas' },
    { id: 'tecnologia', name: 'Tecnología' },
    { id: 'hogar', name: 'Hogar' },
    { id: 'herramientas', name: 'Herramientas' },
    { id: 'auto', name: 'Auto' },
  ];

  // Parallel fetching con Promise.all y manejo de errores
  const categoryPromises = categoriesToFetch.map(cat => 
    cat.id === 'ofertas'
      ? supabase.from('products').select('*').not('precio_regular', 'is', null).order('created_at', { ascending: false }).limit(8)
      : supabase.from('products').select('*').eq('categoria', cat.id).order('created_at', { ascending: false }).limit(8)
  );

  // First, get the date of the most recent product for the "Hoy" section
  const { data: latestForHoy } = await supabase.from('products').select('created_at').order('created_at', { ascending: false }).limit(1).maybeSingle();
  let hoyPromise: Promise<{ data: Product[] | null, error: any }> = Promise.resolve({ data: [], error: null });

  if (latestForHoy) {
    const latestDateStr = latestForHoy.created_at.split('T')[0];
    hoyPromise = supabase.from('products').select('*').gte('created_at', `${latestDateStr}T00:00:00`).lte('created_at', `${latestDateStr}T23:59:59.999`).order('created_at', { ascending: false }).limit(8) as unknown as Promise<{ data: Product[] | null, error: any }>;
  }

  const [
    { data: hoy, error: errorHoy },
    { data: destacadas, error: errorDestacadas },
    { data: virales, error: errorVirales },
    { data: recomendado, error: errorRecomendado },
    ...categoryResults
  ] = await Promise.all([
    hoyPromise,
    supabase.from('products').select('*').eq('destacado', true).limit(3),
    supabase.from('products').select('*').eq('viral', true).order('created_at', { ascending: false }).limit(4),
    supabase.from('products').select('*').eq('recomendado', true).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    ...categoryPromises
  ]);

  if (errorDestacadas || errorVirales || errorRecomendado || errorHoy) {
    console.error("[Homepage] Error fetching curated data:", { errorDestacadas, errorVirales, errorRecomendado, errorHoy });
  }

  // Combinar productos para el Schema ItemList (sólo los más relevantes de la home)
  const allHighlightedProducts = [
    ...(destacadas || []),
    ...(virales || []),
  ].slice(0, 10);

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
      <Script
        id="home-json-ld"
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
            <AffiliateButton href="#categorias" className="text-base md:text-lg shadow-sm bg-ml-blue text-white hover:bg-blue-600">
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

        {/* Carrusel horizontal táctil para categorías y páginas SEO */}
        <div className="mt-8 flex overflow-x-auto gap-2 md:gap-3 justify-start sm:justify-center pb-4 hide-scrollbar px-1 snap-x">
          {[
            { name: "Productos Virales", href: "/productos-virales", icon: <TrendingUp className="w-4 h-4 text-purple-600" /> },
            { name: "Mejores Ofertas", href: "/ofertas-mercado-libre", icon: <Flame className="w-4 h-4 text-red-500" /> },
            { name: "Gadgets Útiles", href: "/gadgets-utiles", icon: <Laptop className="w-4 h-4 text-blue-500" /> },
            { name: "Casa Inteligente", href: "/productos-para-casa", icon: <HomeIcon className="w-4 h-4 text-emerald-500" /> },
            { name: "Accesorios Auto", href: "/productos-para-auto", icon: <Car className="w-4 h-4 text-slate-500" /> },
            { name: "Herramientas", href: "/categoria/herramientas", icon: <Wrench className="w-4 h-4 text-orange-500" /> },
          ].map((link) => (
            <Link key={link.name} href={link.href} className="flex items-center gap-1.5 shrink-0 snap-start px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Gangas de Hoy */}
      {hoy && hoy.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-10 md:mb-16">
          <div className="flex justify-between items-end mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-ml-blue rounded-xl shadow-sm border border-blue-100">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                Gangas de Hoy
              </h2>
            </div>
            <Link href="/hoy" className="hidden md:inline-flex text-sm font-medium text-ml-blue hover:underline items-center gap-1 mb-1">
              Ver más <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {hoy.map((product: Product) => (
              <ProductCard
                key={`hoy-${product.id}`}
                id={product.id}
                titulo={product.titulo}
                imagen={product.imagen || product.imagenes?.[0] || ""}
                precio_regular={product.precio_regular || undefined}
                precio={product.precio}
                link_afiliado={product.link_afiliado}
                slug={product.slug}
                destacado={product.destacado}
              />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/hoy" className="inline-block w-full py-2.5 bg-white border border-gray-200 text-gray-800 font-medium rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              Ver más de hoy
            </Link>
          </div>
        </section>
      )}

      {/* Productos Destacados */}
      {destacadas && destacadas.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-10 md:mb-16">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl shadow-sm border border-amber-100">
                <Star className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                Productos Destacados
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {destacadas.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  titulo={product.titulo}
                  imagen={product.imagen || product.imagenes?.[0] || ""}
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

      {/* Productos por Categoría */}
      {categoriesToFetch.map((cat, index) => {
        const products = categoryResults[index].data;
        if (!products || products.length === 0) return null;

        return (
          <section key={cat.id} id={`cat-${cat.id}`} className="max-w-5xl mx-auto px-4 mb-10 md:mb-16">
            <div className="flex justify-between items-end mb-4 md:mb-6">
              <div className="flex items-center gap-3">
                {getCategoryIcon(cat.id)}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                  {cat.name}
                </h2>
              </div>
              <Link href={`/categoria/${cat.id}`} className="hidden md:inline-flex text-sm font-medium text-ml-blue hover:underline items-center gap-1 mb-1">
                Ver más <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  titulo={product.titulo}
                  imagen={product.imagen || product.imagenes?.[0] || ""}
                  precio_regular={product.precio_regular || undefined}
                  precio={product.precio}
                  link_afiliado={product.link_afiliado}
                  slug={product.slug}
                  destacado={product.destacado}
                />
              ))}
            </div>
            {/* Botón Ver más para mobile */}
            <div className="mt-6 text-center md:hidden">
               <Link href={`/categoria/${cat.id}`} className="inline-block w-full py-2.5 bg-white border border-gray-200 text-gray-800 font-medium rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                 Ver más de {cat.name}
               </Link>
            </div>
          </section>
        );
      })}

      {/* Productos Virales */}
      {virales && virales.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shadow-sm border border-purple-100">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Productos Virales
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {virales.map((product) => (
              <ProductCard
                key={`viral-${product.id}`}
                id={product.id}
                titulo={product.titulo}
                imagen={product.imagen || product.imagenes?.[0] || ""}
                precio_regular={product.precio_regular || undefined}
                precio={product.precio}
                link_afiliado={product.link_afiliado}
                slug={product.slug}
                destacado={true}
                pros={product.pros}
              />
            ))}
          </div>
        </section>
      )}

      {/* Producto Recomendado de la Semana */}
      {recomendado && (
        <section className="bg-white border-y border-gray-200 py-8 md:py-16 mb-10 md:mb-16">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-5 md:gap-8 items-center">
            <Link href={`/producto/${recomendado.slug}`} className="relative w-full md:w-1/2 bg-gray-50 aspect-square rounded-lg flex items-center justify-center p-4 hover:opacity-90 transition-opacity mx-4 md:mx-0 border border-gray-100 overflow-hidden">
              {(recomendado.imagen && (recomendado.imagen.startsWith('http') || recomendado.imagen.startsWith('/'))) || (recomendado.imagenes && recomendado.imagenes[0]) ? (
                <img src={recomendado.imagen || recomendado.imagenes?.[0]} alt={recomendado.titulo} className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-400 text-sm md:text-base">[ Imagen Destacado ]</span>
              )}
            </Link>
            <div className="w-full md:w-1/2 px-2 md:px-0">
              <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-current" /> Recomendación de la semana
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
                      <Check className="w-4 h-4 text-indigo-500 font-bold mt-0.5 shrink-0" />
                      <p className="text-gray-700">{pro}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-indigo-500 font-bold mt-0.5 shrink-0" />
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

      {/* CTA Final */}
      <section className="text-center px-4 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Buscás más cosas que valgan la pena?</h2>
        <p className="text-lg text-gray-600 mb-8">Navegá por nuestra colección completa de hallazgos recomendados.</p>
        <div className="max-w-xs mx-auto">
          <AffiliateButton href="#categorias" variant="yellow" className="text-lg border-2 border-transparent hover:border-gray-900">
            Explorá todas las gangas
          </AffiliateButton>
        </div>
      </section>

    </div>
  );
}
