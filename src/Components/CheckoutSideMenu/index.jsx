import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import OrderCard from '../../Components/OrderCard'
import { totalPrice } from '../../utils'
import './styles.css'

const CheckoutSideMenu = () => {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()

  const handleDelete = (id) => {
    const filteredProducts = context.cartProducts.filter(product => product.id != id)
    context.setCartProducts(filteredProducts)
  }

  const handleCheckout = () => {
    // Check if user is authenticated using new auth system
    if (!context.isAuthenticated || !context.account) {
      alert('Por favor inicia sesión para completar tu compra')
      navigate('/sign-in')
      context.closeCheckoutSideMenu()
      return
    }

    const orderToAdd = {
      date: new Date().toLocaleDateString(),
      products: context.cartProducts,
      totalProducts: context.cartProducts.length,
      totalPrice: totalPrice(context.cartProducts)
    }

    context.setOrder([...context.order, orderToAdd])
    context.setCartProducts([])
    context.closeCheckoutSideMenu()
  }

  return (
    <aside
      className={`${context.isCheckoutSideMenuOpen ? 'flex' : 'hidden'} checkout-side-menu flex-col fixed right-0 border border-black rounded-lg bg-white`}>
      <div className='flex justify-between items-center p-4 md:p-6 border-b border-black/10'>
        <h2 className='font-medium text-lg md:text-xl'>My Order</h2>
        <button
          type="button"
          onClick={() => context.closeCheckoutSideMenu()}
          className='hover:bg-black/5 rounded-full p-1 transition-colors'
          aria-label="Close menu"
        >
          <XMarkIcon className='h-5 w-5 md:h-6 md:w-6 text-black' />
        </button>
      </div>

      <div className='px-4 md:px-6 overflow-y-auto flex-1'>
        {context.cartProducts.length > 0 ? (
          <div className='space-y-3 md:space-y-4'>
            {context.cartProducts.map(product => (
              <OrderCard
                key={product.id}
                id={product.id}
                title={product.title}
                imageUrl={product.images}
                price={product.price}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className='py-8 text-center text-black/60'>
            <p>Your cart is empty</p>
          </div>
        )}
      </div>

      <div className='p-4 md:p-6 border-t border-black/10 space-y-3'>
        <div className='flex justify-between items-center mb-4'>
          <span className='font-light text-sm'>Total:</span>
          <span className='font-bold text-lg md:text-2xl'>${totalPrice(context.cartProducts).toFixed(2)}</span>
        </div>
        <button 
          className='bg-black text-white py-3 w-full rounded-lg hover:bg-black/80 transition-colors font-medium disabled:bg-black/50 disabled:cursor-not-allowed'
          onClick={() => handleCheckout()}
          disabled={context.cartProducts.length === 0}>
          Checkout
        </button>
      </div>
    </aside>
  )
}

export default CheckoutSideMenu