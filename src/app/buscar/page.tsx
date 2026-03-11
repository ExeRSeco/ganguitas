import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ q?: string, cat?: string }>
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  
  if (q) {
    return {
      title: `Resultados para "${q}"`,
      description: `Encuentra las mejores ofertas y resultados para la búsqueda de "${q}" en Ganguitas.`,
      robots: { index: false, follow: true } // Evitamos indexar basura de búsqueda masiva, pero seguimos enlaces
    };
  }

  return {
    title: "Búsqueda de ofertas",
    description: "Busca los mejores chollos, gangas y descuentos en Mercado Libre."
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, cat } = await searchParams;
  const query = q || "";
  const category = cat || "";

  const supabase = await createClient();

  let dbQuery = supabase.from("products").select("*").order("created_at", { ascending: false }).limit(50);

  if (query) {
    dbQuery = dbQuery.ilike("titulo", `%${query}%`);
  }

  if (category) {
    dbQuery = dbQuery.eq("categoria", category);
  }

  const { data: products, error } = await dbQuery;

  if (error) {
    console.error("Error fetching search results", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resultados de búsqueda
          </h1>
          {query ? (
            <p className="text-gray-600">Mostrando resultados para: <span className="font-semibold">&quot;{query}&quot;</span></p>
          ) : (
            <p className="text-gray-600">Explorá nuestras mejores ofertas y productos recomendados.</p>
          )}
          {category && <p className="text-sm text-gray-500 mt-2">Categoría: <span className="capitalize">{category}</span></p>}
        </div>

        {/* Resultados Reales */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products && products.length > 0 ? (
            products.map((product) => (
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
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
               <span className="text-4xl block mb-4">🕵️</span>
               <p className="text-lg font-medium text-gray-900">No encontramos lo que buscas.</p>
               <p className="mt-2 text-sm">Prueba con otras palabras clave o revisa nuestras gangas destacadas en la página principal.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
