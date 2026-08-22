import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchAllProducts, fetchProductsById, fetchProductsByCategory, searchProducts, suggestProducts } from "@/lib/api/product";

export const useProduct = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: fetchAllProducts,
        retry: false,
        staleTime: 1000 * 60 * 5,
    })

    return {
        products: data?.products ?? [],
        loading: isLoading,
        refetchProducts: refetch,
    }
}

export const useProductById = (id) => {
    const { data, isLoading } = useQuery({
        queryKey: ['products', id],
        queryFn: () => fetchProductsById(id),
        enabled: !!id,
        retry: false,
        staleTime: 1000 * 60 * 5,
    })

    return {
        product: data?.product ?? null,
        loading: isLoading,
    }
}

export const useProductsByCategory = (slug) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['products', 'category', slug],
        queryFn: () => fetchProductsByCategory(slug),
        enabled: !!slug,
        retry: false,
        staleTime: 1000 * 60 * 5,
    })

    return {
        products: data?.products ?? [],
        loading: isLoading,
        refetchProducts: refetch,
    }
}

export const useSearchProducts = (params) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['products', 'search', params],
        queryFn: () => searchProducts(params),
        enabled: !!(params?.q && params.q.trim()),
        retry: false,
        staleTime: 1000 * 60 * 2,
    })

    return {
        products: data?.products ?? [],
        total: data?.total ?? 0,
        totalPages: data?.totalPages ?? 0,
        page: data?.page ?? 1,
        loading: isLoading,
        refetchProducts: refetch,
    }
}

export const MIN_SUGGEST_LENGTH = 2;

export const useSearchSuggestions = (q) => {
    const trimmed = q?.trim() ?? '';

    const { data, isFetching, isSuccess } = useQuery({
        queryKey: ['products', 'suggest', trimmed],
        queryFn: () => suggestProducts(trimmed),
        enabled: trimmed.length >= MIN_SUGGEST_LENGTH,
        retry: false,
        staleTime: 1000 * 30,
        placeholderData: keepPreviousData, // keep previous rows visible while typing instead of flashing empty
    })

    return {
        suggestions: data?.products ?? [],
        loading: isFetching,
        settled: isSuccess,
    }
}
