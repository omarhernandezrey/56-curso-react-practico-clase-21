import { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../Components/Layout'

function MyAccount() {
  const context = useContext(ShoppingCartContext)
  const navigate = useNavigate()
  const [view, setView] = useState('user-info')
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const form = useRef(null)

  // Check if user is authenticated
  if (!context.isAuthenticated || !context.account) {
    navigate('/sign-in')
    return null
  }

  const editAccount = (e) => {
    e.preventDefault()
    const formData = new FormData(form.current)
    const name = formData.get('name')?.trim()
    const email = formData.get('email')?.trim()
    const password = formData.get('password')?.trim()

    // Validations
    if (!name || !email || !password) {
      setFeedback({ type: 'error', message: 'All fields are required' })
      return
    }

    if (email.length < 5 || !email.includes('@')) {
      setFeedback({ type: 'error', message: 'Please enter a valid email' })
      return
    }

    if (password.length < 4) {
      setFeedback({ type: 'error', message: 'Password must be at least 4 characters' })
      return
    }

    const data = {
      name,
      email,
      password
    }

    // Update account using context
    context.setAccount(data)
    
    setFeedback({ type: 'success', message: 'Account updated successfully!' })
    setTimeout(() => {
      setView('user-info')
      setFeedback({ type: '', message: '' })
    }, 1500)
  }

  const handleSignOut = () => {
    context.logout()
    navigate('/')
  }

  const renderUserInfo = () => {
    return (
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg border border-black/10 p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Account Information</h2>
          <div className='space-y-4'>
            <div>
              <label className='block text-xs font-medium text-black/60 mb-1'>Name</label>
              <p className='text-lg text-black'>{context.account?.name || 'Not set'}</p>
            </div>
            <div>
              <label className='block text-xs font-medium text-black/60 mb-1'>Email</label>
              <p className='text-lg text-black'>{context.account?.email || 'Not set'}</p>
            </div>
            <div>
              <label className='block text-xs font-medium text-black/60 mb-1'>Password</label>
              <p className='text-lg text-black'>••••••</p>
            </div>
          </div>
        </div>

        <div className='space-y-3'>
          <button
            className='w-full border-2 border-black text-black rounded-lg py-3 font-medium hover:bg-black/5 transition-colors'
            onClick={() => {
              setView('edit-user-info')
              setFeedback({ type: '', message: '' })
            }}>
            Edit Profile
          </button>
          <button
            className='w-full bg-red-600 text-white rounded-lg py-3 font-medium hover:bg-red-700 transition-colors'
            onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  const renderEditUserInfo = () => {
    return (
      <form ref={form} className='w-full max-w-md' onSubmit={editAccount}>
        <div className='bg-white rounded-lg border border-black/10 p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-6'>Edit Profile</h2>
          
          {feedback.message && (
            <div className={`mb-4 p-3 rounded-lg ${
              feedback.type === 'error' 
                ? 'bg-red-100 text-red-800 border border-red-300' 
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}>
              {feedback.message}
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label htmlFor="name" className='block text-sm font-medium text-black mb-1'>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={context.account?.name || ''}
                placeholder="Enter your name"
                className='w-full rounded-lg border border-black/20 px-4 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black'
              />
            </div>

            <div>
              <label htmlFor="email" className='block text-sm font-medium text-black mb-1'>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={context.account?.email || ''}
                placeholder="your@email.com"
                className='w-full rounded-lg border border-black/20 px-4 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black'
              />
            </div>

            <div>
              <label htmlFor="password" className='block text-sm font-medium text-black mb-1'>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                defaultValue={context.account?.password || ''}
                placeholder="Enter your password"
                className='w-full rounded-lg border border-black/20 px-4 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black'
              />
              <p className='text-xs text-black/60 mt-1'>Minimum 4 characters</p>
            </div>
          </div>
        </div>

        <div className='space-y-3'>
          <button
            type="submit"
            className='w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-black/80 transition-colors'>
            Save Changes
          </button>
          <button
            type="button"
            className='w-full border-2 border-black text-black rounded-lg py-3 font-medium hover:bg-black/5 transition-colors'
            onClick={() => {
              setView('user-info')
              setFeedback({ type: '', message: '' })
            }}>
            Cancel
          </button>
        </div>
      </form>
    )
  }

  const renderView = () => view === 'edit-user-info' ? renderEditUserInfo() : renderUserInfo()

  return (
    <Layout>
      <div className='w-full'>
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        <div className='flex justify-center'>
          {renderView()}
        </div>
      </div>
    </Layout>
  )
}

export default MyAccount