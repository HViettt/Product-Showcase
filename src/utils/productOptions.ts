import type { Product, ProductCategory } from "../types/product";

export const getUniqueProductOptions = (products: Product[]) => {
  const categories: (ProductCategory | "All")[] = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const colors = Array.from(new Set(products.map((p) => p.color))).sort();
  const tags = Array.from(new Set(products.flatMap((p) => p.tags))).sort();
  const years = Array.from(new Set(products.map((p) => p.releaseYear))).sort((a, b) => b - a);

  return { categories, brands, colors, tags, years };
};