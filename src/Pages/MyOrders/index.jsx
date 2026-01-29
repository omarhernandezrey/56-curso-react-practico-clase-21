import { useContext } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../Components/Layout'
import OrderCard from '../../Components/OrderCard'

function MyOrders() {
  const context = useContext(ShoppingCartContext)

  return (
    <Layout>
      <div className='w-full'>
        <h1 className='text-3xl font-bold mb-6'>My Orders</h1>
        
        {context.order && context.order.length > 0 ? (
          <div className='space-y-4'>
            {context.order.map((order, index) => (
              <Link
                key={index}
                to={`/my-orders/${index}`}
                className='block'
              >
                <div className='border border-black/10 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white'>
                  <div className='flex justify-between items-center mb-3'>
                    <div>
                      <p className='text-sm text-black/60'>Order #{index + 1}</p>
                      <p className='text-sm font-medium text-black/80'>{order.date}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-black/60'>{order.totalProducts} products</p>
                      <p className='text-lg font-bold'>${order.totalPrice}</p>
                    </div>
                  </div>
                  <div className='flex items-center text-sm text-black/60 hover:text-black transition-colors'>
                    View details
                    <ChevronLeftIcon className='h-4 w-4 ml-2 rotate-180' />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='py-12 text-center'>
            <p className='text-black/60 text-lg mb-4'>No orders yet</p>
            <p className='text-black/40 text-sm mb-6'>Start shopping to create your first order</p>
            <Link to='/' className='inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-black/80 transition-colors'>
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyOrders