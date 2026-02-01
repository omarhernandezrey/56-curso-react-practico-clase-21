import { useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../components/Layout'
import OrderCard from '../../components/OrderCard'
import { totalPrice } from '../../utils'

function MyOrder() {
  const context = useContext(ShoppingCartContext)
  const { id } = useParams()

  // Get the correct order - if id is provided use that, otherwise get the last order
  let order
  if (id) {
    order = context.order[parseInt(id)]
  } else {
    order = context.order?.slice(-1)[0]
  }

  // Handle case where order doesn't exist
  if (!order) {
    return (
      <Layout>
        <div className='w-full py-12 text-center'>
          <p className='text-black/60 text-lg mb-4'>Order not found</p>
          <Link to='/my-orders' className='inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-black/80 transition-colors'>
            Back to Orders
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className='w-full max-w-2xl mx-auto'>
        <div className='flex items-center gap-4 mb-6'>
          <Link to='/my-orders'>
            <ChevronLeftIcon className='h-6 w-6 text-black hover:text-black/70' />
          </Link>
          <h1 className='text-3xl font-bold'>Order Details</h1>
        </div>

        <div className='bg-black/5 rounded-lg p-4 mb-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div>
              <p className='text-xs text-black/60 mb-1'>Order Date</p>
              <p className='font-semibold'>{order.date}</p>
            </div>
            <div>
              <p className='text-xs text-black/60 mb-1'>Total Items</p>
              <p className='font-semibold'>{order.totalProducts}</p>
            </div>
            <div>
              <p className='text-xs text-black/60 mb-1'>Total Price</p>
              <p className='font-semibold text-lg'>${order.totalPrice}</p>
            </div>
            <div>
              <p className='text-xs text-black/60 mb-1'>Status</p>
              <p className='font-semibold text-green-600'>Completed</p>
            </div>
          </div>
        </div>

        <h2 className='text-xl font-semibold mb-4'>Products</h2>
        <div className='space-y-3'>
          {order.products && order.products.length > 0 ? (
            order.products.map(product => (
              <OrderCard
                key={product.id}
                id={product.id}
                title={product.title}
                imageUrl={product.images}
                price={product.price}
              />
            ))
          ) : (
            <p className='text-black/60'>No products in this order</p>
          )}
        </div>

        <div className='mt-8 pt-6 border-t border-black/10'>
          <div className='flex justify-between items-center mb-6'>
            <span className='text-lg font-light'>Order Total:</span>
            <span className='text-3xl font-bold'>${totalPrice(order.products)}</span>
          </div>
          <Link 
            to='/my-orders' 
            className='block w-full bg-black text-white py-3 rounded-lg text-center hover:bg-black/80 transition-colors font-medium'
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default MyOrder