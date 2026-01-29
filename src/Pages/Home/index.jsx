import { useContext } from 'react'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../Components/Layout'
import Card from '../../Components/Card'
import SearchBar from '../../Components/SearchBar'
import ProductDetail from '../../Components/ProductDetail'

function Home() {
  const context = useContext(ShoppingCartContext)

  return (
    <Layout>
      <div className='w-full mb-6 sm:mb-8'>
        <div className='mb-4'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-2'>Find Your Perfect Product</h1>
          <p className='text-black/60 text-sm sm:text-base'>Search by product name or browse by category</p>
        </div>
        <SearchBar />
      </div>

      {/* Results Counter */}
      {context.filteredItems && (
        <div className='mb-4 text-sm text-black/60'>
          Found <span className='font-semibold text-black'>{context.filteredItems.length}</span> products
        </div>
      )}

      {/* Products Grid */}
      <div className='grid gap-4 sm:gap-4 md:gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full'>
        {context.filteredItems && context.filteredItems.length > 0 ? (
          context.filteredItems.map(item => (
            <Card key={item.id} data={item} />
          ))
        ) : (
          <div className='col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4 py-12 text-center'>
            <p className='text-black/60 text-lg'>No products found</p>
            <p className='text-black/40 text-sm mt-2'>Try adjusting your search or filter</p>
          </div>
        )}
      </div>
      <ProductDetail />
    </Layout>
  )
}

export default Home