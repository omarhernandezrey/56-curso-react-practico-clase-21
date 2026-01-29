import { useContext } from 'react'
import { useRoutes, BrowserRouter, Navigate } from 'react-router-dom'
import { ShoppingCartProvider, initializeLocalStorage, ShoppingCartContext } from '../../Context'
import Home from '../Home'
import MyAccount from '../MyAccount'
import MyOrder from '../MyOrder'
import MyOrders from '../MyOrders'
import NotFound from '../NotFound'
import SignIn from '../SignIn'
import Navbar from '../../Components/Navbar'
import CheckoutSideMenu from '../../Components/CheckoutSideMenu'
import './App.css'

const AppRoutes = () => {
  const context = useContext(ShoppingCartContext)
  
  // Use the new authentication system from context
  const isUserAuthenticated = context.isAuthenticated && context.account

  let routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/clothes', element: <Home /> },
    { path: '/electronics', element: <Home /> },
    { path: '/furnitures', element: <Home /> },
    { path: '/toys', element: <Home /> },
    { path: '/others', element: <Home /> },
    { path: '/my-account', element: isUserAuthenticated ? <MyAccount /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/my-order', element: isUserAuthenticated ? <MyOrder /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/my-orders', element: isUserAuthenticated ? <MyOrders /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/my-orders/last', element: isUserAuthenticated ? <MyOrder /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/my-orders/:id', element: isUserAuthenticated ? <MyOrder /> : <Navigate replace to={'/sign-in'} /> },
    { path: '/sign-in', element: <SignIn /> },
    { path: '/*', element: <NotFound /> },
  ])

  return routes
}

const App = () => {
  initializeLocalStorage()

  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <AppRoutes />
        <Navbar />
        <CheckoutSideMenu />
      </BrowserRouter>
    </ShoppingCartProvider>
  )
}

export default App