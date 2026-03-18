import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { Sparkles, PackageOpen } from "lucide-react";

export const metadata = {
  title: "Gangas de Hoy",
  description: "Explora los últimos productos y ofertas subidas recientemente.",
};

export default async function HoyPage() {
  const supabase = await createClient();

  // Get the latest product to determine "today" date
  const { data: latest } = await supabase
    .from('products')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let products: any[] = [];
  
  if (latest) {
    const latestDateStr = latest.created_at.split('T')[0];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('created_at', `${latestDateStr}T00:00:00`)
      .lte('created_at', `${latestDateStr}T23:59:59.999`)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (!error && data) {
      products = data;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8 border-b border-gray-200 pb-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-ml-blue rounded-2xl shadow-sm border border-blue-100 shrink-0">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Gangas de Hoy
            </h1>
            <p className="text-gray-600 md:text-lg">Los últimos productos subidos.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.length > 0 ? (
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
               <p className="text-lg font-medium text-gray-900">Aún no hay productos subidos en esta fecha.</p>
               <p className="mt-2 text-sm">Vuelve más tarde para descubrir las mejores ofertas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
