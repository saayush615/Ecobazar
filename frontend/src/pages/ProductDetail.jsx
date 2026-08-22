import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Rating from '@/components/Rating'
import { useProductById } from '@/hooks/useProduct'
import { useProductReviews } from '@/hooks/useReview'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { LoadingSpinner } from '@/components/ui/loading'

// 'Meat & Fish' -> 'meat-and-fish'  (reverse of backend's slug normalization)
const toCategorySlug = (category) =>
    category?.toLowerCase().replace(/ & /g, '-and-').replace(/\s+/g, '-')

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

const ProductDetail = () => {
    const { id } = useParams()
    const { product, loading } = useProductById(id)
    const { reviews, count, addReview, deleteReview } = useProductReviews(id)
    const { user, isAuthenticated } = useAuth()
    const { handleAddToCart } = useCart()
    const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistItem } = useWishlist()

    const [cartLoading, setCartLoading] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const myReview = reviews.find((r) => r.user?._id === user?.id)
    const hasDiscount =
        product &&
        product.discountPrice !== undefined &&
        product.discountPrice !== null &&
        product.originalPrice !== product.discountPrice

    const handleAddToCartClick = async () => {
        if (!id || cartLoading) return
        setCartLoading(true)
        try {
            await handleAddToCart(id)
        } catch (error) {
            // error already toasted by the hook
        } finally {
            setCartLoading(false)
        }
    }

    const handleToggleWishlist = async () => {
        if (!id || wishlistLoading) return
        setWishlistLoading(true)
        try {
            if (isInWishlist(id)) {
                const wishlistItem = getWishlistItem(id)
                await removeFromWishlist(wishlistItem._id)
            } else {
                await addToWishlist(id)
            }
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong!', { duration: 3000 })
        } finally {
            setWishlistLoading(false)
        }
    }

    const handleDeleteMyReview = async () => {
        if (!myReview || deleting) return
        setDeleting(true)
        try {
            await deleteReview(myReview._id)
        } catch (error) {
            // error already toasted by the hook
        } finally {
            setDeleting(false)
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error('Please select a rating first', { duration: 3000 })
            return
        }
        setSubmitting(true)
        try {
            await addReview({ rating, comment })
            setRating(0)
            setComment('')
        } catch (error) {
            // error already toasted by the hook
        } finally {
            setSubmitting(false)
        }
    }

    // ---- Loading state ----
    if (loading) {
        return (
            <div className='flex flex-col min-h-screen dark:bg-gray-900'>
                <Header />
                <div className='flex items-center justify-center flex-1'>
                    <LoadingSpinner text="Fetching product..." />
                </div>
                <Footer />
            </div>
        )
    }

    // ---- Not found state ----
    if (!product) {
        return (
            <div className='flex flex-col min-h-screen dark:bg-gray-900'>
                <Header />
                <div className='flex flex-col items-center justify-center flex-1 gap-3 px-4 text-center'>
                    <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Product not found</h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        It may have been removed by the seller.
                    </p>
                    <Link to='/' className='text-green-600 dark:text-green-400 hover:underline'>
                        Back to Home
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className='flex flex-col justify-between gap-1 min-h-screen dark:bg-gray-900'>
            <div>
                <Header />

                <div className='container mx-auto px-4 py-6'>

                    {/* Breadcrumb */}
                    <nav className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
                        <Link to='/' className='hover:text-green-600 dark:hover:text-green-400'>Home</Link>
                        <span className='mx-2'>/</span>
                        {product.category ? (
                            <>
                                <Link
                                    to={`/category/${toCategorySlug(product.category)}`}
                                    className='hover:text-green-600 dark:hover:text-green-400'
                                >
                                    {product.category}
                                </Link>
                                <span className='mx-2'>/</span>
                            </>
                        ) : null}
                        <span className='text-gray-800 dark:text-gray-200'>{product.name}</span>
                    </nav>

                    {/* Product section */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-10'>

                        {/* Left: image */}
                        <div className='relative border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 p-8 flex items-center justify-center'>
                            {hasDiscount && (
                                <div className='absolute top-3 left-3 bg-red-500 text-white py-1 px-2 rounded-lg text-xs z-10'>
                                    {`Save ${Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)}%`}
                                </div>
                            )}
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className='w-full max-h-[380px] object-contain'
                                />
                            ) : (
                                <div className='w-full h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg'>
                                    <span className='text-sm text-gray-400'>No image available</span>
                                </div>
                            )}
                        </div>

                        {/* Right: info */}
                        <div className='flex flex-col gap-4'>
                            {product.category && (
                                <span className='w-fit px-3 py-1 rounded-full text-xs font-medium text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900'>
                                    {product.category}
                                </span>
                            )}

                            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                                {product.name}
                            </h1>

                            {/* Rating summary */}
                            <a href='#reviews' className='w-fit group'>
                                <Rating
                                    value={product.averageRating ?? 0}
                                    showValue
                                    count={product.reviewCount ?? 0}
                                    className='group-hover:opacity-80 transition-opacity'
                                />
                            </a>

                            {/* Price */}
                            <div className='flex items-baseline gap-3'>
                                <span className='text-3xl font-bold text-green-600 dark:text-green-400'>
                                    ₹{product.discountPrice ?? product.originalPrice}
                                </span>
                                {hasDiscount && (
                                    <span className='text-lg text-gray-500 line-through'>
                                        ₹{product.originalPrice}
                                    </span>
                                )}
                            </div>

                            {/* Stock */}
                            {product.stock > 0 ? (
                                <span className='w-fit px-3 py-1 rounded-full text-xs font-medium text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900'>
                                    In Stock ({product.stock} units)
                                </span>
                            ) : (
                                <span className='w-fit px-3 py-1 rounded-full text-xs font-medium text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900'>
                                    Out of Stock
                                </span>
                            )}

                            {/* Description */}
                            <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                                <h2 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1'>
                                    Description
                                </h2>
                                <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line'>
                                    {product.description?.trim()
                                        ? product.description
                                        : 'No description provided for this product.'}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className='flex flex-wrap gap-3 pt-2'>
                                <button
                                    onClick={handleAddToCartClick}
                                    disabled={cartLoading || product.stock === 0}
                                    className='flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
                                >
                                    {cartLoading ? (
                                        <LoadingSpinner size="sm" variant="secondary" />
                                    ) : (
                                        <ShoppingBag className='size-5' />
                                    )}
                                    Add to Cart
                                </button>

                                <button
                                    onClick={handleToggleWishlist}
                                    disabled={wishlistLoading}
                                    aria-label={isInWishlist(id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    className={`flex items-center gap-2 px-6 py-2.5 border-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 active:scale-95 ${
                                        isInWishlist(id)
                                            ? 'border-red-300 text-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-400 hover:text-red-500'
                                    }`}
                                >
                                    <Heart
                                        className={`size-5 ${isInWishlist(id) ? 'fill-red-500 text-red-500' : ''}`}
                                    />
                                    {isInWishlist(id) ? 'Wishlisted' : 'Wishlist'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews section */}
                    <section id='reviews' className='scroll-mt-24'>
                        <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                            Reviews ({count})
                        </h2>

                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                            {/* List */}
                            <div className='lg:col-span-2 flex flex-col gap-4'>
                                 {count === 0 ? (
                                    <p className='text-sm text-gray-500 dark:text-gray-400 py-10 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded-lg'>
                                        No reviews yet{isAuthenticated ? '' : ' — log in to be the first!'}
                                    </p>
                                ) : (
                                    reviews.map((review) => {
                                        const isMine = review.user?._id === user?.id
                                        return (
                                            <div
                                                key={review._id}
                                                className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
                                            >
                                                <div className='flex items-start justify-between gap-3 mb-2'>
                                                    <div className='flex items-center gap-3'>
                                                        <div className='size-9 shrink-0 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold'>
                                                            {review.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                                                        </div>
                                                        <div>
                                                            <p className='text-sm font-medium text-gray-900 dark:text-white'>
                                                                {review.user?.name ?? 'User'}
                                                                {isMine && (
                                                                    <span className='ml-1.5 text-xs text-green-600 dark:text-green-400 font-normal'>
                                                                        (You)
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <Rating value={review.rating} size='sm' />
                                                        </div>
                                                    </div>

                                                    {isMine && (
                                                        <button
                                                            onClick={handleDeleteMyReview}
                                                            disabled={deleting}
                                                            aria-label="Delete my review"
                                                            className='text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50'
                                                        >
                                                            <Trash2 className='size-4' />
                                                        </button>
                                                    )}
                                                </div>

                                                {review.comment?.trim() ? (
                                                    <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                                                        {review.comment}
                                                    </p>
                                                ) : (
                                                    <p className='text-sm text-gray-400 dark:text-gray-500 italic'>
                                                        No written comment.
                                                    </p>
                                                )}

                                                <p className='mt-2 text-xs text-gray-400 dark:text-gray-500'>
                                                    {formatDate(review.createdAt)}
                                                </p>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Write / manage your review */}
                            <div>
                                {!isAuthenticated ? (
                                    <div className='border border-gray-200 dark:border-gray-700 rounded-lg p-5 text-center'>
                                        <p className='text-sm text-gray-600 dark:text-gray-300 mb-3'>
                                            Log in to share your experience with this product.
                                        </p>
                                        <Link
                                            to='/login'
                                            className='inline-block px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
                                        >
                                            Log In
                                        </Link>
                                    </div>
                                ) : myReview ? (
                                    <div className='border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-5'>
                                        <p className='text-sm font-medium text-gray-800 dark:text-gray-100 mb-1'>
                                            You already reviewed this product
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                                            One review per product. Delete yours below if you want to write a new one.
                                        </p>
                                        <button
                                            onClick={handleDeleteMyReview}
                                            disabled={deleting}
                                            className='px-4 py-2 border-2 border-red-300 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-sm font-medium cursor-pointer disabled:opacity-50'
                                        >
                                            {deleting ? 'Deleting...' : 'Delete My Review'}
                                        </button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmitReview}
                                        className='border border-gray-200 dark:border-gray-700 rounded-lg p-5 flex flex-col gap-4'
                                    >
                                        <h3 className='font-semibold text-gray-900 dark:text-white'>Write a Review</h3>

                                        <div>
                                            <p className='text-sm text-gray-700 dark:text-gray-300 mb-1'>Your rating *</p>
                                            <Rating value={rating} onChange={setRating} size='lg' />
                                        </div>

                                        <div>
                                            <textarea
                                                rows={4}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                maxLength={500}
                                                placeholder='Share details of your experience...'
                                                className='w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors resize-y text-sm'
                                            />
                                            <p className='text-right text-xs text-gray-400 mt-1'>{comment.length}/500</p>
                                        </div>

                                        <button
                                            type='submit'
                                            disabled={submitting}
                                            className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
                                        >
                                            {submitting ? 'Posting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProductDetail