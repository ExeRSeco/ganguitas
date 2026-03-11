export type BadgeType = 'recomendado' | 'oferta' | 'mas_vendido';

interface ProductBadgeProps {
  type: BadgeType;
}

export default function ProductBadge({ type }: ProductBadgeProps) {
  switch (type) {
    case 'recomendado':
      return <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wide">Recomendado</span>;
    case 'oferta':
      return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wide">Oferta</span>;
    case 'mas_vendido':
      return <span className="inline-flex items-center gap-1 bg-ml-yellow-light text-foreground text-xs font-semibold px-2 py-1 rounded-sm uppercase tracking-wide">Más vendido</span>;
    default:
      return null;
  }
}
