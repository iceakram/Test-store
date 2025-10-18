import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Welcome to E-Store
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/products" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Shop Now
            </Link>
            <Link href="/about" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary-600">
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="fill-current text-gray-50"
          viewBox="0 0 1440 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 48h1440V0C1440 0 1200 48 720 48S0 0 0 0v48z" />
        </svg>
      </div>
    </div>
  );
}
