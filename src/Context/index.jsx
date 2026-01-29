import { createContext, useState, useEffect } from 'react'

export const ShoppingCartContext = createContext()

// Storage keys
const STORAGE_KEYS = {
  ACCOUNT: 'shopi_account',
  IS_AUTHENTICATED: 'shopi_is_authenticated',
  CART_PRODUCTS: 'shopi_cart_products',
  ORDERS: 'shopi_orders'
}

export const initializeLocalStorage = () => {
  try {
    // Initialize account
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNT)) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(null))
    }

    // Initialize authentication state
    if (!localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED)) {
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, JSON.stringify(false))
    }

    // Initialize cart
    if (!localStorage.getItem(STORAGE_KEYS.CART_PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.CART_PRODUCTS, JSON.stringify([]))
    }

    // Initialize orders
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]))
    }
  } catch (error) {
    console.error('Error initializing localStorage:', error)
  }
}

const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error)
  }
}

export const ShoppingCartProvider = ({ children }) => {
  // Authentication
  const [account, setAccount] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Shopping Cart
  const [count, setCount] = useState(0)
  const [cartProducts, setCartProducts] = useState([])

  // Product Detail
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const openProductDetail = () => setIsProductDetailOpen(true)
  const closeProductDetail = () => setIsProductDetailOpen(false)

  // Checkout Side Menu
  const [isCheckoutSideMenuOpen, setIsCheckoutSideMenuOpen] = useState(false)
  const openCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(true)
  const closeCheckoutSideMenu = () => setIsCheckoutSideMenuOpen(false)

  // Product to show
  const [productToShow, setProductToShow] = useState({})

  // Orders
  const [order, setOrder] = useState([])

  // Products
  const [items, setItems] = useState(null)
  const [filteredItems, setFilteredItems] = useState(null)

  // Search filters
  const [searchByTitle, setSearchByTitle] = useState(null)
  const [searchByCategory, setSearchByCategory] = useState(null)

  // Initialize from localStorage on mount
  useEffect(() => {
    initializeLocalStorage()
    
    const savedAccount = getFromStorage(STORAGE_KEYS.ACCOUNT)
    const savedIsAuthenticated = getFromStorage(STORAGE_KEYS.IS_AUTHENTICATED, false)
    const savedCartProducts = getFromStorage(STORAGE_KEYS.CART_PRODUCTS, [])
    const savedOrders = getFromStorage(STORAGE_KEYS.ORDERS, [])

    setAccount(savedAccount)
    setIsAuthenticated(savedIsAuthenticated)
    setCartProducts(savedCartProducts)
    setOrder(savedOrders)
    
    setLoading(false)
  }, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products')
        if (response.ok) {
          const data = await response.json()
          setItems(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Persist account to localStorage
  useEffect(() => {
    setToStorage(STORAGE_KEYS.ACCOUNT, account)
  }, [account])

  // Persist authentication state
  useEffect(() => {
    setToStorage(STORAGE_KEYS.IS_AUTHENTICATED, isAuthenticated)
  }, [isAuthenticated])

  // Persist cart products
  useEffect(() => {
    setToStorage(STORAGE_KEYS.CART_PRODUCTS, cartProducts)
  }, [cartProducts])

  // Persist orders
  useEffect(() => {
    setToStorage(STORAGE_KEYS.ORDERS, order)
  }, [order])

  // Authentication functions
  const login = (accountData) => {
    setAccount(accountData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setAccount(null)
    setIsAuthenticated(false)
    setCartProducts([])
  }

  // Filter functions
  const filteredItemsByTitle = (items, searchByTitle) => {
    return items?.filter(item =>
      item.title.toLowerCase().includes(searchByTitle.toLowerCase())
    )
  }

  const filteredItemsByCategory = (items, searchByCategory) => {
    return items?.filter(item =>
      item.category?.name.toLowerCase().includes(searchByCategory.toLowerCase())
    )
  }

  const filterBy = (searchType, items, searchByTitle, searchByCategory) => {
    if (searchType === 'BY_TITLE') {
      return filteredItemsByTitle(items, searchByTitle)
    }

    if (searchType === 'BY_CATEGORY') {
      return filteredItemsByCategory(items, searchByCategory)
    }

    if (searchType === 'BY_TITLE_AND_CATEGORY') {
      return filteredItemsByCategory(items, searchByCategory).filter(item =>
        item.title.toLowerCase().includes(searchByTitle.toLowerCase())
      )
    }

    return items
  }

  // Update filtered items when search or category changes
  useEffect(() => {
    if (searchByTitle && searchByCategory) {
      setFilteredItems(filterBy('BY_TITLE_AND_CATEGORY', items, searchByTitle, searchByCategory))
    } else if (searchByTitle && !searchByCategory) {
      setFilteredItems(filterBy('BY_TITLE', items, searchByTitle, searchByCategory))
    } else if (!searchByTitle && searchByCategory) {
      setFilteredItems(filterBy('BY_CATEGORY', items, searchByTitle, searchByCategory))
    } else {
      setFilteredItems(filterBy(null, items, searchByTitle, searchByCategory))
    }
  }, [items, searchByTitle, searchByCategory])

  const value = {
    // Authentication
    account,
    setAccount,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    loading,

    // Shopping Cart
    count,
    setCount,
    cartProducts,
    setCartProducts,

    // Product Detail
    isProductDetailOpen,
    openProductDetail,
    closeProductDetail,
    productToShow,
    setProductToShow,

    // Checkout
    isCheckoutSideMenuOpen,
    openCheckoutSideMenu,
    closeCheckoutSideMenu,

    // Orders
    order,
    setOrder,

    // Products
    items,
    setItems,
    filteredItems,
    searchByTitle,
    setSearchByTitle,
    searchByCategory,
    setSearchByCategory,
  }

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  )
}


