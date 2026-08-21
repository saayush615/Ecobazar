import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { categoies } from '@/config/categories'
import { useSearchProducts } from '@/hooks/useProduct'
import useDebounce from '@/hooks/useDebounce'
import { LoadingOverlay } from '@/components/ui/loading'
import { Switch } from '@/components/ui/switch'
import { SlidersHorizontal } from 'lucide-react'

const SearchResultPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const qParam = searchParams.get('q') ?? '';
    const categoryParam = searchParams.get('category') ?? '';
    const minParam = searchParams.get('min') ?? '';
    const maxParam = searchParams.get('max') ?? '';
    const inStockParam = searchParams.get('inStock') === 'true';
    const sortParam = searchParams.get('sort') ?? 'relevance';
    const pageParam = parseInt(searchParams.get('page') ?? '1', 10) || 1;

    const [minInput, setMinInput] = useState(minParam);
    const [maxInput, setMaxInput] = useState(maxParam);

    const debouncedMin = useDebounce(minInput, 450);
    const debouncedMax = useDebounce(maxInput, 450);

    // 1. URL's query string in sync with filter state
    // updateURL = a memoized function that takes an object of {key: value} changes and merges them into the current URL search params.
    const updateURL = useCallback((changes) => { // changes — an object where keys are search param names and values are the new values to set (e.g. { min: '10', max: '50' })
        const next = new URLSearchParams(searchParams);
        Object.entries(changes).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) {
                next.delete(key);
            } else {
                next.set(key, String(value));
            }
            if (key !== 'page') next.delete('page');
        });
        if (next.toString() === searchParams.toString()) return;
        setSearchParams(next, { replace: true });
    }, [searchParams]);

    useEffect(() => {
        updateURL({ min: debouncedMin, max: debouncedMax });
    }, [debouncedMin, debouncedMax, updateURL]);

    const params = {
        q: qParam.trim() || undefined,
        category: categoryParam || undefined,
        minPrice: minParam || undefined,
        maxPrice: maxParam || undefined,
        inStock: inStockParam ? 'true' : undefined,
        sort: sortParam === 'relevance' ? undefined : sortParam,
        page: pageParam,
    };

    const { products, total, totalPages, loading } = useSearchProducts(params);

    const toggleCategory = (title) => {
        updateURL({ category: categoryParam === title ? '' : title });
    };

    const toggleInStock = (checked) => {
        updateURL({ inStock: checked ? 'true' : '' });
    };

    const handleSortChange = (e) => {
        updateURL({ sort: e.target.value === 'relevance' ? '' : e.target.value });
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages || page === pageParam) return;
        updateURL({ page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPageItems = (current, total) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = [1];
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < total - 1) pages.push('...');
        pages.push(total);
        return pages;
    };
    const pageItems = getPageItems(pageParam, totalPages);

    return (
        <>
        <LoadingOverlay show={loading} text="Searching..." />
        <div className='flex flex-col justify-between min-h-screen dark:bg-gray-900'>
            <div>
                <Header />
                <div className='container mx-auto px-4 py-6'>
                    <div className='mb-6'>
                        <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                            {qParam.trim()
                                ? <>Search results for <span className='text-green-600'>&ldquo;{qParam}&rdquo;</span></>
                                : 'Search Products'}
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            {total > 0 ? `${total} product${total === 1 ? '' : 's'} found` : 'No products found'}
                        </p>
                    </div>

                    <div className='flex flex-col md:flex-row gap-6'>
                        <aside className='w-full md:w-60 shrink-0'>
                            <div className='flex items-center gap-2 mb-4'>
                                <SlidersHorizontal className='w-5 h-5 text-gray-700 dark:text-gray-200' />
                                <h2 className='font-semibold text-gray-900 dark:text-white'>Filters</h2>
                            </div>

                            <div className='mb-6'>
                                <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>Category</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {categoies.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.title)}
                                            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                                categoryParam === cat.title
                                                    ? 'bg-green-500 text-white border-green-500'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-green-500'
                                            }`}
                                        >
                                            {cat.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className='mb-6'>
                                <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>Price Range</h3>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type="number"
                                        value={minInput}
                                        onChange={(e) => setMinInput(e.target.value)}
                                        placeholder='Min'
                                        className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500'
                                    />
                                    <span className='text-gray-500 dark:text-gray-400'>-</span>
                                    <input
                                        type="number"
                                        value={maxInput}
                                        onChange={(e) => setMaxInput(e.target.value)}
                                        placeholder='Max'
                                        className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500'
                                    />
                                </div>
                            </div>

                            <div className='mb-6 flex items-center justify-between'>
                                <label htmlFor='in-stock' className='text-sm font-medium text-gray-900 dark:text-white'>
                                    In stock only
                                </label>
                                <Switch id='in-stock' checked={inStockParam} onCheckedChange={toggleInStock} />
                            </div>

                            <div>
                                <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>Sort by</h3>
                                <select
                                    value={sortParam}
                                    onChange={handleSortChange}
                                    className='w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500'
                                >
                                    <option value='relevance'>Relevance</option>
                                    <option value='price_asc'>Price: Low to High</option>
                                    <option value='price_desc'>Price: High to Low</option>
                                    <option value='newest'>Newest</option>
                                </select>
                            </div>
                        </aside>

                        <section className='flex-1'>
                            {!qParam.trim() ? (
                                <div className='text-center py-16'>
                                    <p className='text-gray-600 dark:text-gray-400'>
                                        Search from the search bar at the top to find products.
                                    </p>
                                </div>
                            ) : products.length === 0 && !loading ? (
                                <div className='text-center py-16'>
                                    <p className='text-gray-600 dark:text-gray-400'>
                                        No products match &ldquo;{qParam}&rdquo;. Try a different search term or clear filters.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0'>
                                        {products.map((product) => (
                                            <ProductCard
                                                key={product._id}
                                                prodId={product._id}
                                                name={product.name}
                                                source={product.image}
                                                originalPrice={product.originalPrice}
                                                discountedPrice={product.discountPrice}
                                            />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className='flex items-center justify-center gap-2 mt-8'>
                                            <button
                                                onClick={() => goToPage(pageParam - 1)}
                                                disabled={pageParam === 1}
                                                className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 disabled:opacity-40 hover:border-green-500 transition-colors'
                                            >
                                                Prev
                                            </button>
                                            {pageItems.map((item, idx) =>
                                                item === '...' ? (
                                                    <span key={`ellipsis-${idx}`} className='px-2 text-gray-500 dark:text-gray-400'>...</span>
                                                ) : (
                                                    <button
                                                        key={item}
                                                        onClick={() => goToPage(item)}
                                                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                                            item === pageParam
                                                                ? 'bg-green-500 text-white'
                                                                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-green-500'
                                                        }`}
                                                    >
                                                        {item}
                                                    </button>
                                                )
                                            )}
                                            <button
                                                onClick={() => goToPage(pageParam + 1)}
                                                disabled={pageParam === totalPages}
                                                className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 disabled:opacity-40 hover:border-green-500 transition-colors'
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        </>
    )
}

export default SearchResultPage