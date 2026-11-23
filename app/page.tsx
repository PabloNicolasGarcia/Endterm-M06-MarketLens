export const revalidate = 60;

import ProductsListClient from './ProductsListClient';


export default async function Home() {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=30');
    if (!response.ok) {
      throw new Error('Error al cargar los productos');
    }

    const productsData = await response.json();
    return (
        <main>
            <h1>
              MarketLens
            </h1>
            <ProductsListClient products={productsData.products} />
        </main>
    );
} catch (error: any) {
    return (
      <p>Error al cargar los productos</p>
    )
  }
}
