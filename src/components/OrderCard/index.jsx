import { XMarkIcon } from '@heroicons/react/24/solid'

const OrderCard = props => {
  const { id, title, imageUrl, price, handleDelete } = props
  
  let renderXMarkIcon
  if (handleDelete) {
    renderXMarkIcon = (
      <button
        type="button"
        onClick={() => handleDelete(id)}
        className='text-black hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-colors'
        aria-label="Remove item"
      >
        <XMarkIcon className='h-5 w-5 md:h-6 md:w-6' />
      </button>
    )
  }

  // Handle array of images from API
  const imageSource = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl

  return (
    <div className="flex justify-between items-center gap-2 md:gap-4 pb-4 md:pb-6 border-b border-black/10 last:border-b-0">
      <div className='flex items-center gap-2 md:gap-3 flex-1 min-w-0'>
        <figure className='w-16 h-16 md:w-20 md:h-20 flex-shrink-0'>
          <img 
            className='w-full h-full rounded-lg object-cover' 
            src={imageSource} 
            alt={title}
            loading="lazy"
          />
        </figure>
        <p className='text-xs md:text-sm font-light text-black truncate md:overflow-visible md:line-clamp-2'>
          {title}
        </p>
      </div>
      <div className='flex items-center gap-2 md:gap-3 flex-shrink-0'>
        <p className='text-sm md:text-lg font-medium whitespace-nowrap'>${price}</p>
        {renderXMarkIcon}
      </div>
    </div>
  )
}

export default OrderCard