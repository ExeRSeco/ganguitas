import ProductCard from "@/components/ui/ProductCard";

export default function TodaysBargainsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20 pt-8">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-12 text-center bg-ml-yellow rounded-xl p-8 shadow-sm">
           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
             Gangas de Hoy ⚡
           </h1>
           <p className="text-lg text-gray-800 max-w-2xl mx-auto">
             Descubrí los mejores descuentos antes de que se agoten. Esta lista se actualiza todos los días con oportunidades únicas.
           </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductCard titulo="Soporte Magnético Auto" imagen="/soporte.jpg" precio_regular={15000} precio={9500} link_afiliado="#" destacado={true} />
          <ProductCard titulo="Mini Aspiradora" imagen="/aspiradora.jpg" precio_regular={45000} precio={29000} link_afiliado="#" destacado={true} />
          <ProductCard titulo="Destornilladores 115 en 1" imagen="/img1.jpg" precio_regular={22000} precio={14500} link_afiliado="#" destacado={true} />
          <ProductCard titulo="Tira Luz LED RGB" imagen="/img3.jpg" precio_regular={19500} precio={12000} link_afiliado="#" destacado={true} />
          <ProductCard titulo="Termo Inteligente Acero" imagen="/img6.jpg" precio_regular={16000} precio={9900} link_afiliado="#" destacado={true} />
          <ProductCard titulo="Organizador Baúl" imagen="/organizador.jpg" precio_regular={18000} precio={12000} link_afiliado="#" destacado={true} />
        </div>

      </div>
    </div>
  );
}
