"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Product } from "@/types/product";
import { z } from "zod";

// Zod Schema para validación estricta
const ProductSchema = z.object({
  titulo: z.string().min(5, "El título debe tener al menos 5 caracteres").max(100, "El título es demasiado largo"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  descripcion: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  precio: z.number().min(1, "El precio debe ser mayor a 0"),
  precio_regular: z.number().nullable().optional(),
  categoria: z.string().min(2, "Debes seleccionar una categoría"),
  link_afiliado: z.string().url("El enlace de afiliado debe ser una URL válida (Ej: https://...)"),
  destacado: z.boolean(),
  recomendado: z.boolean(),
  viral: z.boolean(),
  pros: z.array(z.string()).max(3, "Máximo 3 pros permitidos").optional(),
});

export default function AdminPage() {
  const supabase = createClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("lista");
  const [products, setProducts] = useState<Product[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioRegular, setPrecioRegular] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [linkAfiliado, setLinkAfiliado] = useState("");
  const [destacado, setDestacado] = useState(false);
  const [recomendado, setRecomendado] = useState(false);
  const [viral, setViral] = useState(false);
  const [pros, setPros] = useState<string[]>(['', '', '']);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const handleEditClick = (product: Product) => {
    setEditId(product.id);
    setTitulo(product.titulo);
    setSlug(product.slug);
    setDescripcion(product.descripcion || "");
    setPrecio(product.precio.toString());
    setPrecioRegular(product.precio_regular ? product.precio_regular.toString() : "");
    setCategoria(product.categoria);
    setLinkAfiliado(product.link_afiliado);
    setDestacado(product.destacado);
    setRecomendado(product.recomendado || false);
    setViral(product.viral || false);
    setPros(product.pros && product.pros.length > 0 ? [...product.pros, '', '', ''].slice(0, 3) : ['', '', '']);
    // Vaciamos imágenes para que si no sube nada nuevo, conserve las de la DB
    setImagenes([]); 
    setActiveTab("nuevo");
  };

  const resetForm = () => {
    setEditId(null);
    setTitulo(""); setSlug(""); setDescripcion(""); setPrecio(""); setPrecioRegular(""); setCategoria(""); setImagenes([]); setLinkAfiliado(""); setDestacado(false); setRecomendado(false); setViral(false); setPros(['', '', '']);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleDeleteProduct = async (id: string, titulo: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${titulo}"?`)) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw new Error(error.message);
        toast.success("Producto eliminado exitosamente");
        fetchProducts(); // Refrescar la lista
      } catch (error) {
        toast.error("Error al eliminar: " + (error instanceof Error ? error.message : "Desconocido"));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imagenes.length === 0 && !editId) {
      toast.error("Debes seleccionar al menos una imagen para un producto nuevo.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Zod Validation (Pre-flight check)
      const unvalidatedData = {
        titulo,
        slug,
        descripcion,
        precio: Number(precio),
        precio_regular: precioRegular ? Number(precioRegular) : null,
        categoria,
        link_afiliado: linkAfiliado,
        destacado,
        recomendado,
        viral,
        pros: pros.filter(p => p.trim() !== '')
      };

      // Si Zod detecta inyecciones o errores, arrojará un z.ZodError bloqueando la subida
      const validatedProductData = ProductSchema.parse(unvalidatedData);

      // 2. Upload Images
      const publicUrls: string[] = [];

      for (const file of imagenes) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("Fallo subiendo imagen: " + uploadError.message);
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        publicUrls.push(data.publicUrl);
      }

      // 3. Prepare Final DB payload
      const finalPayload: Partial<Product> = { ...validatedProductData };

      if (publicUrls.length > 0) {
         finalPayload.imagen = publicUrls[0];
         finalPayload.imagenes = publicUrls;
      }

      // 4. Save to DB
      let dbError;
      
      if (editId) {
        const { error } = await supabase.from('products').update(finalPayload).eq('id', editId);
        dbError = error;
      } else {
        const { error } = await supabase.from('products').insert([finalPayload]);
        dbError = error;
      }

      if (dbError) throw new Error("Fallo en la base de datos: " + dbError.message);

      toast.success(`Producto ${editId ? 'actualizado' : 'guardado'} con éxito!`);
      resetForm();
      fetchProducts();
      setActiveTab("lista");

    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        // Zod validation failed
        toast.error("Datos inválidos: " + err.issues[0].message);
      } else if (err instanceof Error) {
        // Network / Supabase error
        toast.error("Error guardando: " + err.message);
      } else {
        toast.error("Ocurrió un error inesperado al guardar.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(p => p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || p.categoria.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-ml-blue">Ganguitas Admin</h2>
          <p className="text-sm text-gray-500 mt-1">Panel de control</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <button 
            onClick={() => { resetForm(); setActiveTab("nuevo"); }}
            className={`text-left px-4 py-2 rounded-md transition-colors ${activeTab === "nuevo" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {editId ? "✏️ Editar Producto" : "+ Nuevo Producto"}
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab("lista"); }}
            className={`text-left px-4 py-2 rounded-md transition-colors ${activeTab === "lista" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
          >
            Lista de Productos
          </button>
        </nav>

        <div className="pt-4 border-t border-gray-200">
           <button 
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 rounded-md text-red-600 font-medium hover:bg-red-50 transition-colors"
           >
             Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 max-h-screen overflow-y-auto">
        {activeTab === "nuevo" ? (
          <div className="max-w-3xl bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{editId ? "Editar Producto" : "Crear Nuevo Producto"}</h1>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none" placeholder="Ej: Mini Aspiradora..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input type="text" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none" placeholder="ej: mini-aspiradora" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea rows={4} value={descripcion} onChange={e => setDescripcion(e.target.value)} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none" placeholder="Escribe tu reseña honesta aquí..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Regular ($) Opcional</label>
                  <input type="number" value={precioRegular} onChange={e => setPrecioRegular(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none" placeholder="45000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Oferta ($)</label>
                  <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none" placeholder="29000" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select value={categoria} onChange={e => setCategoria(e.target.value)} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none bg-white">
                    <option value="">Seleccionar...</option>
                    <option value="herramientas">Herramientas</option>
                    <option value="hogar">Hogar</option>
                    <option value="auto">Auto</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="ofertas">Ofertas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del Producto</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={e => setImagenes(Array.from(e.target.files || []))} 
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  />
                  {imagenes.length > 0 ? (
                    <p className="text-sm text-gray-500 mt-2">{imagenes.length} archivo(s) nuevo(s) seleccionado(s)</p>
                  ) : editId ? (
                     <p className="text-xs text-orange-600 mt-2">Déjalo vacío para mantener las imágenes actuales.</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enlace de Afiliado (Mercado Libre)</label>
                <input type="url" value={linkAfiliado} onChange={e => setLinkAfiliado(e.target.value)} required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none" placeholder="https://..." />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-3 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <input type="checkbox" id="destacado" checked={destacado} onChange={e => setDestacado(e.target.checked)} className="w-5 h-5 text-ml-blue rounded border-gray-300 focus:ring-ml-blue" />
                  <label htmlFor="destacado" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Destacar (Home)
                  </label>
                </div>
                
                <div className="flex-1 flex items-center gap-3 bg-indigo-50 p-4 rounded-md border border-indigo-100">
                  <input type="checkbox" id="recomendado" checked={recomendado} onChange={e => setRecomendado(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600" />
                  <label htmlFor="recomendado" className="text-sm font-medium text-gray-900 cursor-pointer">
                    🌟 Semanal
                  </label>
                </div>

                <div className="flex-1 flex items-center gap-3 bg-red-50 p-4 rounded-md border border-red-100">
                  <input type="checkbox" id="viral" checked={viral} onChange={e => setViral(e.target.checked)} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-600" />
                  <label htmlFor="viral" className="text-sm font-medium text-gray-900 cursor-pointer">
                    🔥 Viral (TikTok)
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <label className="block text-sm font-medium text-gray-900 mb-3">🌟 3 Motivos: ¿Por qué vale la pena? (Pros)</label>
                <div className="space-y-3">
                  {[0, 1, 2].map(index => (
                    <div key={index} className="flex gap-2">
                      <span className="bg-white border border-gray-300 rounded text-gray-500 w-8 flex items-center justify-center font-bold text-sm shrink-0">{index + 1}</span>
                      <input 
                        type="text" 
                        value={pros[index] || ""} 
                        onChange={e => {
                          const newPros = [...pros];
                          newPros[index] = e.target.value;
                          setPros(newPros);
                        }} 
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none" 
                        placeholder={index === 0 ? "Ej: Material de excelente calidad..." : `Motivo ${index + 1} (opcional)`} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                {editId && (
                   <button type="button" onClick={() => { resetForm(); setActiveTab("lista"); }} className="px-6 py-2.5 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                     Cancelar
                   </button>
                )}
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="bg-ml-blue text-white font-medium px-6 py-2.5 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isUploading ? "Guardando..." : (editId ? "Actualizar Producto" : "Guardar Producto")}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Productos Publicados</h1>
              <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar producto..." className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-ml-blue focus:border-ml-blue outline-none" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="px-6 py-4 font-medium">Producto</th>
                    <th className="px-6 py-4 font-medium">Categoría</th>
                    <th className="px-6 py-4 font-medium">Precio</th>
                    <th className="px-6 py-4 font-medium">Recomendado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.length > 0 ? filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded shrink-0 overflow-hidden relative">
                            {prod.imagen.startsWith('http') ? <Image src={prod.imagen} alt="" fill className="w-full h-full object-cover" /> : null}
                          </div>
                          <span className="font-medium text-gray-900 line-clamp-1">{prod.titulo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{prod.categoria}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${prod.precio.toLocaleString('es-AR')}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                        {prod.destacado && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Destacado
                          </span>
                        )}
                        {prod.recomendado && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            🌟 Semanal
                          </span>
                        )}
                        {prod.viral && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            🔥 Viral
                          </span>
                        )}
                        {!prod.destacado && !prod.recomendado && !prod.viral && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Normal
                          </span>
                        )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-gray-500 mr-4">🔥 {prod.views} | 🖱 {prod.clicks}</span>
                        <button 
                          onClick={() => handleEditClick(prod)}
                          className="text-sm text-ml-blue hover:text-blue-800 font-medium transition-colors mr-4"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(prod.id, prod.titulo)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay productos. Ocurrió un error o la lista está vacía.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
