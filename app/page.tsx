export const revalidate = 60;

import ProductsListClient from './ProductsListClient';
import type { Product } from './product-types';

export default async function Home() {
  let productsData: { products: Product[] };
  let categories: string[];

  try {
    const response = await fetch('https://dummyjson.com/products?limit=30');
    if (!response.ok) {
      throw new Error('Error al cargar los productos');
    }
    productsData = await response.json();

    const categoriesResponse = await fetch('https://dummyjson.com/products/category-list');
    if (!categoriesResponse.ok) {
      throw new Error('Error al cargar las categorías');
    }
    categories = await categoriesResponse.json();
  } catch {
    return (
      <p>Error al cargar los productos</p>
    )
  }
  return (
      <main>
          <h1>
            MarketLens
          </h1>
          <ProductsListClient products={productsData.products} categories={categories} />
      </main>
    );
}
