import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/solid';

export default function ProductCard({ product }) {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({product.numReviews})</span>
      </div>
    );
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
          {product.isFeatured && (
            <span className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 text-xs font-semibold rounded">
              Featured
            </span>
          )}
          {product.countInStock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription || product.description}
        </p>

        <div className="mb-3">{renderStars(product.rating || 0)}</div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ${product.price}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.comparePrice}
              </span>
            )}
          </div>

          {product.countInStock > 0 && product.countInStock <= product.lowStockThreshold && (
            <span className="text-xs text-orange-600 font-semibold">
              Only {product.countInStock} left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
