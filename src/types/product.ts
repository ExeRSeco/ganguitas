export interface Product {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  precio: number;
  precio_regular: number | null;
  categoria: string;
  imagen: string;
  imagenes: string[];
  link_afiliado: string;
  destacado: boolean;
  recomendado: boolean;
  pros: string[];
  views: number;
  clicks: number;
  created_at: string;
}

export type ProductInput = Omit<Product, 'id' | 'views' | 'clicks' | 'created_at'>;
