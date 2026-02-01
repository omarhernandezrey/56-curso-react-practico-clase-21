const Layout = ({ children }) => {
  return (
    <div className='flex flex-col items-center w-full pt-32 sm:pt-48 lg:pt-[80px] pb-24 sm:pb-8 px-3 sm:px-4 md:px-6'>
      <div className='w-full max-w-7xl'>
        {children}
      </div>
    </div>
  )
}

export default Layout