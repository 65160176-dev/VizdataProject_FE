export const useProductImage = () => {
  const getProductImage = (product) => {
    if (!product) return 'https://placehold.co/400'
    
    // รองรับ image field จาก API (string)
    if (product.image) {
      if (product.image.startsWith('http')) {
        return product.image
      }
      return `/images/${product.image}`
    }
    
    // Fallback สำหรับ mock data เก่า (images array)
    if (product.images && product.images[0]) {
      const img = product.images[0].src || product.images[0]
      return `/images/${img}`
    }
    
    return 'https://placehold.co/400'
  }

  return {
    getProductImage
  }
}
