import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchProductReviews as fetchProductReviewsApi,
  addReview as addReviewApi,
  deleteReview as deleteReviewApi,
} from '@/lib/api/review'

export const useProductReviews = (productId) => {
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => fetchProductReviewsApi(productId),
        enabled: !!productId,
        retry: false,
        staleTime: 1000 * 30,
    })

    const invalidateReviewCaches = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
        queryClient.invalidateQueries({ queryKey: ['products', productId] })
    }, [queryClient, productId])

    const addReviewMutation = useMutation({
        mutationFn: ({ rating, comment }) => addReviewApi(productId, { rating, comment }),
        onSettled: invalidateReviewCaches,
    })

    const deleteReviewMutation = useMutation({
        mutationFn: deleteReviewApi,
        onMutate: async (reviewId) => {
            await queryClient.cancelQueries({ queryKey: ['reviews', productId] })
            const previousReviews = queryClient.getQueryData(['reviews', productId])
            if (previousReviews) {
                queryClient.setQueryData(['reviews', productId], {
                    ...previousReviews,
                    count: Math.max(0, (previousReviews.count || 0) - 1),
                    reviews: previousReviews.reviews?.filter(item => item._id !== reviewId) || [],
                })
            }
            return { previousReviews }
        },
        onError: (err, reviewId, context) => {
            if (context?.previousReviews) {
                queryClient.setQueryData(['reviews', productId], context.previousReviews)
            }
        },
        onSettled: invalidateReviewCaches,
    })

    const addReview = useCallback(async ({ rating, comment }) => {
        try {
            const result = await addReviewMutation.mutateAsync({ rating, comment })
            toast.success('Review Posted', {
                description: 'Thanks for your feedback!', duration: 3000,
            })
            return result
        } catch (error) {
            toast.error('Failed to post review', {
                description: error?.response?.data?.error || 'Try Again!', duration: 3000,
            })
            throw error
        }
    }, [addReviewMutation])

    const deleteReview = useCallback(async (reviewId) => {
        try {
            const result = await deleteReviewMutation.mutateAsync(reviewId)
            toast.success('Review Deleted', { duration: 3000 })
            return result
        } catch (error) {
            toast.error('Something went wrong!', {
                description: error?.response?.data?.error || 'Try Again!', duration: 3000,
            })
            throw error
        }
    }, [deleteReviewMutation])

    return {
        reviews: data?.reviews ?? [],
        count: data?.count ?? 0,
        loading: isLoading,
        refetchReviews: refetch,
        addReview,
        deleteReview,
    }
}

export default useProductReviews