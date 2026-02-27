import { motion } from "framer-motion";
import { Tag, Loader2, ImageOff } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import type { ProductResponse } from "@shared/routes";

export default function Products() {
  const { data: products, isLoading, error } = useProducts();

  return (
    <div className="min-h-screen bg-orange-50/30 pt-16 pb-24">
      <div className="bg-primary pt-20 pb-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black text-white mb-6"
          >
            Nossos <span className="text-white/90">Produtos</span>
          </motion.h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium">
            Descubra nossas novidades e super ofertas. Lembre-se: Nada passa de R$ 30,00!
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Carregando produtos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-red-100">
            <p className="text-red-500 font-bold mb-2">Ops! Ocorreu um erro ao carregar os produtos.</p>
            <p className="text-muted-foreground">Tente recarregar a página.</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: ProductResponse, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-border">
            <div className="w-20 h-20 bg-orange-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-display mb-2">Nenhum produto cadastrado</h3>
            <p className="text-muted-foreground">Em breve adicionaremos muitas novidades aqui!</p>
          </div>
        )}

      </div>
    </div>
  );
}

// Separate component for cleaner animation mapping
function ProductCard({ product, index }: { product: ProductResponse, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-border group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2JjYmNiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiLz48L3N2Zz4=';
            }}
          />
        ) : (
          <ImageOff className="w-12 h-12 text-gray-300" />
        )}
        
        {product.isPromotion && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
            <Tag className="w-3 h-3" />
            Super Oferta
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Por apenas</span>
            <span className="text-2xl font-display font-black text-primary">
              R$ {Number(product.price).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Additional lucide-react import fix for this file context
import { ShoppingBag } from "lucide-react";
