import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  // Usamos el entorno para que funcione bien en desarrollo y producción
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ganguitas.com'

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at, categoria')

  // Generate URLs for all products
  const productUrls: MetadataRoute.Sitemap = products?.map((product) => ({
    url: `${baseUrl}/producto/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  // Extract unique categories from existing products to index category pages
  const categories = Array.from(new Set(products?.map(p => p.categoria).filter(Boolean)))
  
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/categoria/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Return static pages + dynamic generated arrays
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/productos-virales`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gadgets-utiles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ofertas-mercado-libre`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/productos-para-auto`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/productos-para-casa`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/buscar`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.6,
    },
    ...categoryUrls,
    ...productUrls,
  ]
}
