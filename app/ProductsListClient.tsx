"use client";

import { Product } from './product-types';
import { useRef, useState, useMemo, useEffect } from 'react';


export default function ProductsListClient({ products, categories }: { products: Product[], categories: string[] }) {
    
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [listProducts, setListProducts] = useState(products);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const filteredProducts = useMemo (
        () => listProducts.filter(
            product => product.title.toLowerCase().includes(search.toLowerCase()) && 
            (category === "" || product.category === category) && 
            (minPrice === "" || product.price >= parseFloat(minPrice)) &&
            (maxPrice === "" || product.price <= parseFloat(maxPrice))
        ),
         [listProducts, search, category, minPrice, maxPrice]
    );

    const hasUsedFilters =useRef(false);
    
    useEffect(() => {
        const hasActiveFilters = search !== "" || category !== "" || minPrice !== "" || maxPrice !== "";

        if (!hasActiveFilters && !hasUsedFilters.current) {
            return;
        }

        hasUsedFilters.current = true;
        
        const controller = new AbortController();

        async function searchProducts() {
            setLoading(true);
            setError(null);
            try {
                let url;
                if (search !== "") {
                    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=0`;
                }
                const limit = hasActiveFilters ? 0 : 30;
                const response = await fetch(
                    url || `https://dummyjson.com/products?limit=${limit}`, { signal: controller.signal }
                );
                if (!response.ok) {
                    throw new Error("Error al buscar productos");
                }
                const data = await response.json();
                if (!controller.signal.aborted) {
                    setListProducts(data.products);
                }
            } catch {
                if (!controller.signal.aborted) {
                    setError("No se pudieron cargar los productos");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }
        searchProducts();
        return () => controller.abort();        
    }, [products, search, category, minPrice, maxPrice]);

    return (
        <>
        <input type="text" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} /> 
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas las categorias</option>
            {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>
        <input type="number" placeholder="Precio mínimo" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}/>
        <input type="number" placeholder="Precio máximo" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}/>
        <button onClick={() => { setSearch(""); setCategory(""); setMinPrice(""); setMaxPrice(""); }}>Limpiar busqueda</button>
        <p>Mostrando {filteredProducts.length} de {listProducts.length} productos</p>
        {loading ? (
            <p>Cargando productos...</p>
        ) : error ? (
            <p>{error}</p>
        ) : (
        filteredProducts.length === 0 ? (
            <p>No se encontraron productos</p>
        ) : (
        <ul>
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <h2>{product.title}</h2>
                </li>
              ))}
        </ul>
        ))}
        </>
    )
}