/**
 * This function calculates total price of a new order
 * @param {Array} products cartProduct: Array of Objects
 * @returns {number} Total price
 */
export const totalPrice = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return 0
  }
  
  let sum = 0
  products.forEach(product => {
    const price = parseFloat(product.price) || 0
    sum += price
  })
  
  return parseFloat(sum.toFixed(2))
}