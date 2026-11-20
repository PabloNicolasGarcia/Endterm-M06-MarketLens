
export const revalidate = 60;

type Product = {
  id: number;
  title:string;
}

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
            <ul>
              {productsData.products.map((product: Product) => (
                <li key={product.id}>
                  <h2>{product.title}</h2>
                </li>
              ))}
            </ul>
        </main>
    );
} catch (error: any) {
    return (
      <p>Error al cargar los productos</p>
    )
  }
}
