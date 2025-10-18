import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1 bg-gray-200">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-300">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {product.name}
        </h3>
        
        {product.category && (
          <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
        )}
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${parseFloat(product.compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        {product.quantity === 0 && (
          <p className="mt-2 text-sm text-red-600 font-medium">Out of Stock</p>
        )}
      </div>
    </Link>
  );
}
