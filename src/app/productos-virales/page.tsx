import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { TrendingUp, PackageOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Productos Virales de Mercado Libre | Ganguitas",
  description: "Descubre cuáles son los gadgets y productos más virales de TikTok que están volando en Mercado Libre Argentina.",
  openGraph: {
    title: "Productos Virales de Mercado Libre | Ganguitas",
    description: "Descubre cuáles son los gadgets y productos más virales de TikTok que están volando en Mercado Libre Argentina.",
  }
};

export default async function ProductosViralesPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("viral", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching viral products", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-8 border-b border-gray-200 pb-6 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm border border-purple-100 shrink-0">
            <TrendingUp className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Los Productos Más Virales
            </h1>
            <p className="text-gray-600 md:text-lg">Los gadgets de TikTok y redes sociales que valen totalmente la pena.</p>
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
               <p className="text-lg font-medium text-gray-900">Aún no hay productos virales.</p>
               <p className="mt-2 text-sm">Pronto añadiremos los mejores hallazgos de internet. ¡Vuelve luego!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
