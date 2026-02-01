import { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../components/Layout'

function SignIn() {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()
  const [view, setView] = useState('login')
  const formRef = useRef(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (context.isAuthenticated && context.account) {
      navigate('/')
    }
  }, [context.isAuthenticated, context.account, navigate])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password && password.length >= 4
  }

  const validateName = (name) => {
    return name && name.trim().length >= 2
  }

  const clearForm = () => {
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const formData = new FormData(formRef.current)
      const email = formData.get('email')?.trim()
      const password = formData.get('password')?.trim()

      // Validations
      if (!email || !password) {
        setError('Por favor completa todos los campos')
        setIsLoading(false)
        return
      }

      if (!validateEmail(email)) {
        setError('El email no es válido')
        setIsLoading(false)
        return
      }

      // Get stored account
      const storedAccount = context.account

      if (!storedAccount || !storedAccount.email) {
        setError('No hay cuenta registrada. Por favor crea una.')
        setIsLoading(false)
        setTimeout(() => setView('register'), 1500)
        return
      }

      // Check credentials
      if (storedAccount.email !== email || storedAccount.password !== password) {
        setError('Email o contraseña incorrectos')
        clearForm()
        setIsLoading(false)
        return
      }

      // Success
      setSuccess('¡Login exitoso! Redirigiendo...')
      context.login(storedAccount)

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const formData = new FormData(formRef.current)
      const name = formData.get('name')?.trim()
      const email = formData.get('email')?.trim()
      const password = formData.get('password')?.trim()
      const confirmPassword = formData.get('confirmPassword')?.trim()

      // Validations
      if (!name || !email || !password || !confirmPassword) {
        setError('Por favor completa todos los campos')
        setIsLoading(false)
        return
      }

      if (!validateName(name)) {
        setError('El nombre debe tener mínimo 2 caracteres')
        setIsLoading(false)
        return
      }

      if (!validateEmail(email)) {
        setError('El email no es válido')
        setIsLoading(false)
        return
      }

      if (!validatePassword(password)) {
        setError('La contraseña debe tener mínimo 4 caracteres')
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        setIsLoading(false)
        return
      }

      // Create account
      const newAccount = {
        name,
        email,
        password
      }

      // Save and login
      context.setAccount(newAccount)
      context.login(newAccount)

      setSuccess('¡Cuenta creada exitosamente! Redirigiendo...')
      clearForm()

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      setError('Error al crear la cuenta. Intenta de nuevo.')
      console.error('Register error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderLoginForm = () => (
    <form ref={formRef} className='flex flex-col w-full max-w-sm gap-4' onSubmit={handleLogin}>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}
      {success && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm'>
          {success}
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <label htmlFor="email" className='font-medium text-sm'>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="correo@ejemplo.com"
          className='rounded-lg border border-black/20 px-4 py-2.5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20'
          required
          disabled={isLoading}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="password" className='font-medium text-sm'>
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Mínimo 4 caracteres"
          className='rounded-lg border border-black/20 px-4 py-2.5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20'
          required
          disabled={isLoading}
        />
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='bg-black text-white w-full rounded-lg py-3 mt-4 hover:bg-black/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>

      <button
        type='button'
        onClick={() => {
          setView('register')
          setError('')
          setSuccess('')
          clearForm()
        }}
        disabled={isLoading}
        className='border-2 border-black text-black w-full rounded-lg py-2.5 hover:bg-black/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
        ¿No tienes cuenta? Crear una
      </button>
    </form>
  )

  const renderRegisterForm = () => (
    <form ref={formRef} className='flex flex-col w-full max-w-sm gap-4' onSubmit={handleRegister}>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm'>
          {error}
        </div>
      )}
      {success && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm'>
          {success}
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <label htmlFor="name" className='font-medium text-sm'>
          Nombre Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Juan Pérez"
          className='rounded-lg border border-black/20 px-4 py-2.5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20'
          required
          disabled={isLoading}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="email" className='font-medium text-sm'>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="correo@ejemplo.com"
          className='rounded-lg border border-black/20 px-4 py-2.5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20'
          required
          disabled={isLoading}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="password" className='font-medium text-sm'>
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Mínimo 4 caracteres"
          className='rounded-lg border border-black/20 px-4 py-2.5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20'
          required
          disabled={isLoading}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor="confirmPassword" className='font-medium text-sm'>
          Confirmar Contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Repite tu contraseña"
          className='rounded-lg border border-black/20 px-4 py-2.5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20'
          required
          disabled={isLoading}
        />
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='bg-black text-white w-full rounded-lg py-3 mt-4 hover:bg-black/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>

      <button
        type='button'
        onClick={() => {
          setView('login')
          setError('')
          setSuccess('')
          clearForm()
        }}
        disabled={isLoading}
        className='border-2 border-black text-black w-full rounded-lg py-2.5 hover:bg-black/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
        Volver al login
      </button>
    </form>
  )

  if (context.loading) {
    return (
      <Layout>
        <div className='flex justify-center items-center py-20'>
          <p className='text-gray-600'>Cargando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className='w-full flex justify-center'>
        <div className='w-full max-w-sm'>
          <h1 className="font-bold text-3xl text-center mb-2">
            {view === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
          </h1>
          <p className='text-center text-black/60 text-sm mb-8'>
            {view === 'login'
              ? 'Inicia sesión en tu cuenta para continuar'
              : 'Completa el formulario para crear tu cuenta'}
          </p>
          {view === 'login' ? renderLoginForm() : renderRegisterForm()}
        </div>
      </div>
    </Layout>
  )
}

export default SignIn
