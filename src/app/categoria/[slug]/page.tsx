import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  
  return {
    title: `Las mejores gangas en ${title}`,
    description: `Explora nuestra selección de ofertas, descuentos y productos recomendados en la categoría ${title}. Compras inteligentes garantizadas.`,
    openGraph: {
      title: `Las mejores gangas en ${title}`,
      description: `Explora nuestra selección de ofertas en la categoría ${title}.`,
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  
  // Formatear el slug para el título (ej: "home-y-deco" -> "Home y deco")
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  const supabase = await createClient();

  const { data: products, error } = await (slug === "ofertas"
    ? supabase.from("products").select("*").not("precio_regular", "is", null).order("created_at", { ascending: false }).limit(50)
    : supabase.from("products").select("*").eq("categoria", slug).order("created_at", { ascending: false }).limit(50)
  );

  if (error) {
    console.error("Error fetching category products", error);
  }

  // Opcional: Si quieres mostrar 404 para categorías vacías, descomenta:
  // if (!products || products.length === 0) {
  //   notFound();
  // }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Categoría: {title}
          </h1>
          <p className="text-gray-600">Explorá las mejores gangas en {title.toLowerCase()}.</p>
        </div>
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
               <span className="text-4xl block mb-4">🛒</span>
               <p className="text-lg font-medium text-gray-900">Aún no hay ofertas en esta categoría.</p>
               <p className="mt-2 text-sm">Pronto añadiremos los mejores hallazgos. ¡Vuelve luego!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
