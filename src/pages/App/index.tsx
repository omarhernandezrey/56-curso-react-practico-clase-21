/**
 * App - Main Application Component
 * Entry point de la aplicación con routing y layout
 */

import { FC, useMemo } from 'react';
import { useRoutes, BrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../../store/index.js';
import ErrorBoundary from '../../components/ErrorBoundary/index.js';
import Home from '../Home/index.jsx';
import MyAccount from '../MyAccount/index.jsx';
import MyOrder from '../MyOrder/index.jsx';
import MyOrders from '../MyOrders/index.jsx';
import NotFound from '../NotFound/index.jsx';
import SignIn from '../SignIn/index.jsx';
import Navbar from '../../components/Navbar/index.jsx';
import CheckoutSideMenu from '../../components/CheckoutSideMenu/index.jsx';

/**
 * Rutas de la aplicación
 */
const AppRoutes: FC = () => {
  const { isAuthenticated } = useAuth();

  const routes = useMemo(
    () => [
      { path: '/', element: <Home /> },
      { path: '/clothes', element: <Home /> },
      { path: '/electronics', element: <Home /> },
      { path: '/furnitures', element: <Home /> },
      { path: '/toys', element: <Home /> },
      { path: '/others', element: <Home /> },
      {
        path: '/my-account',
        element: isAuthenticated ? <MyAccount /> : <Navigate replace to="/sign-in" />,
      },
      {
        path: '/my-order',
        element: isAuthenticated ? <MyOrder /> : <Navigate replace to="/sign-in" />,
      },
      {
        path: '/my-orders',
        element: isAuthenticated ? <MyOrders /> : <Navigate replace to="/sign-in" />,
      },
      {
        path: '/my-orders/last',
        element: isAuthenticated ? <MyOrder /> : <Navigate replace to="/sign-in" />,
      },
      {
        path: '/my-orders/:id',
        element: isAuthenticated ? <MyOrder /> : <Navigate replace to="/sign-in" />,
      },
      { path: '/sign-in', element: <SignIn /> },
      { path: '/*', element: <NotFound /> },
    ],
    [isAuthenticated]
  );

  return useRoutes(routes);
};

/**
 * App Component - Layout principal
 */
const App: FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <CheckoutSideMenu />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
