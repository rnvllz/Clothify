import React, { useEffect, useState } from "react";
import { productService } from "../api/api";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/ProductGridSkeleton";
import type { Product } from "../types/database";

interface CategoryPageProps {
  title: string;
  description: string;
  filterType: "gender" | "category";
  filterValue: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ title, description, filterType, filterValue }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data: Product[];
        if (filterType === "gender") {
          data = await productService.getByGender(filterValue);
        } else {
          data = await productService.getByCategory(filterValue);
        }
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filterType, filterValue]);

  if (loading) return (
    <div className="container mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-black mb-2 tracking-wide">{title}</h1>
        <p className="text-gray-500 font-light text-sm">{description}</p>
      </div>
      <ProductGridSkeleton />
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-red-500 font-light text-sm">{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-black mb-2 tracking-wide">{title}</h1>
        <p className="text-gray-500 font-light text-sm">{description}</p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 font-light">No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
