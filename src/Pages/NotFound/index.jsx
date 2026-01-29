import { Link } from 'react-router-dom'
import Layout from '../../Components/Layout'

function NotFound() {
  return (
    <Layout>
      <div className='w-full h-96 flex flex-col items-center justify-center text-center'>
        <h1 className='text-6xl md:text-8xl font-bold mb-4 text-black/20'>404</h1>
        <h2 className='text-2xl md:text-4xl font-bold mb-2'>Page Not Found</h2>
        <p className='text-black/60 mb-8 max-w-md'>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to='/' 
          className='bg-black text-white px-8 py-3 rounded-lg hover:bg-black/80 transition-colors font-medium'
        >
          Go Back Home
        </Link>
      </div>
    </Layout>
  )
}

export default NotFound