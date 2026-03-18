import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PackageOpen, Flame, Laptop, Home as HomeIcon, Wrench, Car, Zap } from "lucide-react";

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'ofertas': return <div className="p-3 bg-red-50 text-red-500 rounded-2xl shadow-sm border border-red-100 shrink-0"><Flame className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'tecnologia': return <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shadow-sm border border-blue-100 shrink-0"><Laptop className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'hogar': return <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl shadow-sm border border-emerald-100 shrink-0"><HomeIcon className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'herramientas': return <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl shadow-sm border border-orange-100 shrink-0"><Wrench className="w-8 h-8 md:w-10 md:h-10" /></div>;
    case 'auto': return <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl shadow-sm border border-slate-200 shrink-0"><Car className="w-8 h-8 md:w-10 md:h-10" /></div>;
    default: return <div className="p-3 bg-gray-50 text-gray-600 rounded-2xl shadow-sm border border-gray-200 shrink-0"><Zap className="w-8 h-8 md:w-10 md:h-10" /></div>;
  }
};

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
        
        <div className="mb-8 border-b border-gray-200 pb-6 flex items-center gap-4">
          {getCategoryIcon(slug)}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Categoría: {title}
            </h1>
            <p className="text-gray-600 md:text-lg">Explorá las mejores gangas en {title.toLowerCase()}.</p>
          </div>
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
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-gray-500">
               <PackageOpen className="w-16 h-16 text-gray-300 mb-4" />
               <p className="text-lg font-medium text-gray-900">Aún no hay ofertas en esta categoría.</p>
               <p className="mt-2 text-sm">Pronto añadiremos los mejores hallazgos. ¡Vuelve luego!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
