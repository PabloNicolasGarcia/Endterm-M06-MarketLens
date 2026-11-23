"use client";

import { Product } from './product-types';

export default function ProductsListClient({ products }: { products: Product[] }) {
    return (
        <ul>
              {products.map((product) => (
                <li key={product.id}>
                  <h2>{product.title}</h2>
                </li>
              ))}
        </ul>
    )
}