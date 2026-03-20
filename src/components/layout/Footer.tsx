import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
        
        {/* Col 1 */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-base">Ganguitas</h3>
          <p className="mb-4">
            Curamos y filtramos las mejores ofertas y productos de Mercado Libre para que compres de forma inteligente.
          </p>
          <p>© {new Date().getFullYear()} Ganguitas. Todos los derechos reservados.</p>
        </div>

        {/* Col 2 */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-base">Descubre (Lo más buscado)</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/productos-virales" className="hover:text-ml-blue transition-colors">🔥 Productos Virales</Link>
            </li>
            <li>
              <Link href="/ofertas-mercado-libre" className="hover:text-ml-blue transition-colors">💥 Mejores Ofertas</Link>
            </li>
            <li>
              <Link href="/gadgets-utiles" className="hover:text-ml-blue transition-colors">💡 Gadgets y Novedades</Link>
            </li>
            <li>
              <Link href="/productos-para-casa" className="hover:text-ml-blue transition-colors">🏠 Productos para Casa</Link>
            </li>
            <li>
              <Link href="/productos-para-auto" className="hover:text-ml-blue transition-colors">🚗 Accesorios para Auto</Link>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-base">Navegación</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="hover:text-ml-blue transition-colors">Inicio</Link>
            </li>
            <li>
              <Link href="/#categorias" className="hover:text-ml-blue transition-colors">Todas las Categorías</Link>
            </li>
            <li>
              <Link href="/buscar" className="hover:text-ml-blue transition-colors">Buscador</Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
