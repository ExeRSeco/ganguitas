import ProductCard from "@/components/ui/ProductCard";

export default function TopProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-12 text-center">
           <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Ranking de Gangas 🔥</h1>
           <p className="text-lg text-gray-600">Los hallazgos más comprados por la comunidad.</p>
        </div>

        {/* Top productos del día */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
            <span className="bg-ml-yellow text-gray-900 font-bold px-3 py-1 rounded text-sm uppercase tracking-wider">Top Hoy</span>
            <h2 className="text-2xl font-bold text-gray-900">Top productos del día</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ProductCard titulo="Mini Aspiradora Portátil Inalámbrica" imagen="/aspiradora.jpg" precio_regular={45000} precio={29000} link_afiliado="#" destacado={true} />
            <ProductCard titulo="Termo Inteligente Acero" imagen="/img6.jpg" precio={9900} link_afiliado="#" destacado={true} />
            <ProductCard titulo="Soporte Magnético Auto" imagen="/soporte.jpg" precio_regular={15000} precio={9500} link_afiliado="#" />
            <ProductCard titulo="Limpiador 7 en 1" imagen="/img7.jpg" precio={7500} link_afiliado="#" />
          </div>
        </section>

        {/* Top productos de la semana */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-3">
            <span className="bg-orange-500 text-white font-bold px-3 py-1 rounded text-sm uppercase tracking-wider">Top Semana</span>
            <h2 className="text-2xl font-bold text-gray-900">Top productos de la semana</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ProductCard titulo="Silla Oficina Ergonómica" imagen="/silla.jpg" precio_regular={245000} precio={185000} link_afiliado="#" destacado={true} />
            <ProductCard titulo="Proyector Smart Portátil" imagen="/proyector.jpg" precio={115000} link_afiliado="#" />
            <ProductCard titulo="Tira LED Inteligente" imagen="/img3.jpg" precio_regular={19500} precio={12000} link_afiliado="#" destacado={true} />
            <ProductCard titulo="Auriculares Bluetooth 5.3" imagen="/img2.jpg" precio={18900} link_afiliado="#" />
          </div>
        </section>

      </div>
    </div>
  );
}
