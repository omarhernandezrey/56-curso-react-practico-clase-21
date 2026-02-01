import { useContext } from 'react'
import { XMarkIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import './styles.css'

const ProductDetail = () => {
  const context = useContext(ShoppingCartContext)

  const addProductsToCart = (event, productData) => {
    event.stopPropagation()
    context.setCount(context.count + 1)
    context.setCartProducts([...context.cartProducts, productData])
  }

  const isInCart = context.productToShow.id && 
    context.cartProducts.filter(product => product.id === context.productToShow.id).length > 0

  // Handle images from API
  const images = context.productToShow.images
  const imageSource = Array.isArray(images) ? images[0] : images

  return (
    <aside
      className={`${context.isProductDetailOpen ? 'flex' : 'hidden'} product-detail flex-col fixed right-0 border border-black rounded-lg bg-white`}>
      <div className='flex justify-between items-center p-4 md:p-6 border-b border-black/10'>
        <h2 className='font-medium text-lg md:text-xl'>Product Detail</h2>
        <button
          type="button"
          onClick={() => context.closeProductDetail()}
          className='hover:bg-black/5 rounded-full p-1 transition-colors'
          aria-label="Close detail"
        >
          <XMarkIcon className='h-5 w-5 md:h-6 md:w-6 text-black' />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6'>
        <figure className='mb-4 md:mb-6 w-full'>
          <img
            className='w-full h-auto rounded-lg object-cover max-h-80'
            src={imageSource}
            alt={context.productToShow.title}
          />
        </figure>

        <div className='space-y-3 md:space-y-4'>
          <div>
            <span className='text-xs md:text-sm text-black/60 bg-black/5 inline-block px-2 py-1 rounded'>
              {context.productToShow.category?.name || 'Product'}
            </span>
          </div>

          <div>
            <p className='font-medium text-2xl md:text-3xl mb-2'>
              ${context.productToShow.price}
            </p>
            <h3 className='font-semibold text-base md:text-lg'>
              {context.productToShow.title}
            </h3>
          </div>

          <div>
            <p className='font-light text-sm md:text-base text-black/70'>
              {context.productToShow.description}
            </p>
          </div>
        </div>
      </div>

      <div className='p-4 md:p-6 border-t border-black/10'>
        <button
          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            isInCart
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-black text-white hover:bg-black/80'
          }`}
          onClick={(event) => !isInCart && addProductsToCart(event, context.productToShow)}
          disabled={isInCart}>
          {isInCart ? (
            <>
              <CheckIcon className='h-5 w-5' />
              Added to Cart
            </>
          ) : (
            <>
              <PlusIcon className='h-5 w-5' />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

export default ProductDetail