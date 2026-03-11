import Image from "next/image";
import AffiliateButton from "@/components/ui/AffiliateButton";
import ProductBadge from "@/components/ui/ProductBadge";
import ProductCard from "@/components/ui/ProductCard";
import Link from 'next/link';

export default async function ProductPage() {
  // En un proyecto real, se buscaría el producto basado en `slug`
  // Mock data para ejemplo:
  const product = {
    titulo: "Mini Aspiradora Portátil Inalámbrica Para Auto",
    precio_regular: 45000,
    precio: 29000,
    rating: 4.7,
    reviews: 1250,
    imagen: "/aspiradora-grande.jpg",
    link_afiliado: "https://mercadolibre.com",
    benefits: [
      "Succión potente de 8000Pa para limpiar polvo y pelos de mascota.",
      "Batería recargable de larga duración (hasta 30 minutos continuos).",
      "Filtro HEPA lavable, no necesitas comprar repuestos."
    ],
    whyIsWorthIt: "Esta mini aspiradora es perfecta porque tiene la potencia de una grande pero cabe en la guantera del auto. Cientos de compradores resaltan que les ahorra el lavadero cada semana y que por el precio que tiene, se paga sola en el primer mes de uso.",
    destacado: true
  };

  const discount = product.precio_regular ? Math.round(((product.precio_regular - product.precio) / product.precio_regular) * 100) : 0;
  const badge = product.destacado ? 'recomendado' : (discount > 0 ? 'oferta' : undefined);

  return (
    <div className="min-h-screen bg-gray-50 text-foreground pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Breadcrumb nav minimalista */}
        <nav className="flex text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/categoria/auto" className="hover:text-blue-600">Auto</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 truncate">{product.titulo}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 lg:gap-12 mb-12">
          
          {/* 1. Imagen Grande */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center rounded-md border border-gray-100">
               {product.imagen.startsWith('/') ? (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    [ Imagen del Producto ]
                 </div>
               ) : (
                 <Image src={product.imagen} alt={product.titulo} fill className="object-contain p-4" />
               )}
            </div>
            
            {/* Galería pequeña mock */}
            <div className="flex gap-2 justify-center">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-16 h-16 bg-gray-100 rounded border border-gray-200 cursor-pointer hover:border-blue-500"></div>
              ))}
            </div>
          </div>

          {/* Detalles del Producto */}
          <div className="w-full md:w-1/2 flex flex-col">
            
            {/* Etiquetas */}
            <div className="mb-3">
              {badge && <ProductBadge type={badge as any} />}
            </div>

            {/* 2. Título */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              {product.titulo}
            </h1>

            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="flex text-ml-blue gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'text-ml-blue' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews} opiniones)</span>
            </div>

            {/* 3. Precio */}
            <div className="mb-8">
              {product.precio_regular && (
                <p className="text-sm text-gray-400 line-through mb-1">
                  ${product.precio_regular.toLocaleString('es-AR')}
                </p>
              )}
              <div className="flex items-center gap-3">
                <span className="text-4xl tracking-tight font-light text-gray-900">
                  ${product.precio.toLocaleString('es-AR')}
                </span>
                {discount > 0 && (
                  <span className="text-lg font-medium text-green-600">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-green-600 font-medium mt-2">Envío gratis disponible</p>
            </div>

            {/* 4. 3 Beneficios */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Lo que tenés que saber de este producto</h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Botón afiliado grande */}
            <div className="mt-auto mb-8">
              <AffiliateButton href={product.link_afiliado} variant="blue" className="text-xl py-4 shadow-sm hover:shadow-md">
                VER OFERTA EN MERCADO LIBRE
              </AffiliateButton>
            </div>

            {/* 6. Por qué vale la pena */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 md:p-5 mt-2 relative">
              <div className="absolute -top-3 left-4 md:left-5 bg-orange-100 text-orange-800 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Reseña Honesta
              </div>
              <h3 className="font-bold text-gray-900 mb-2 mt-2 md:mt-1">Por qué vale la pena</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.whyIsWorthIt}
              </p>
            </div>

          </div>
        </div>

        {/* 7. Productos Relacionados */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Productos relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <ProductCard titulo="Soporte Magnético de Celular para Auto Baseus" imagen="/soporte.jpg" precio_regular={15000} precio={9500} link_afiliado="https://mercadolibre.com" destacado={true} slug="soporte-baseus" />
            <ProductCard titulo="Compresor De Aire Portátil Para Autos" imagen="/compresor.jpg" precio={35000} link_afiliado="https://mercadolibre.com" slug="compresor-aire" />
            <ProductCard titulo="Organizador De Baúl Plegable Reforzado" imagen="/organizador.jpg" precio_regular={18000} precio={12000} link_afiliado="https://mercadolibre.com" slug="organizador-baul" />
            <ProductCard titulo="Cargador Rápido Para Auto USB-C 65W" imagen="/cargador.jpg" precio={22000} link_afiliado="https://mercadolibre.com" destacado={true} slug="cargador-rapido" />
          </div>
        </div>

      </div>
    </div>
  );
}
