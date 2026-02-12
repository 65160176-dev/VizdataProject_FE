export const useProductImage = () => {
  const getProductImage = (product) => {
    if (!product) return 'https://placehold.co/400'

    const resolveUrl = (url) => {
      if (!url || (typeof url === 'string' && url.trim() === '')) return null
      if (url.startsWith('http')) return url
      if (url.startsWith('/')) return `http://localhost:3001${url}`
      return `http://localhost:3001/${url}`
    }
    
    // รองรับ image field จาก API (string)
    const fromImage = resolveUrl(product.image)
    if (fromImage) return fromImage
    
    // Fallback สำหรับ mock data เก่า (images array)
    if (product.images && product.images.length > 0) {
      const img = product.images[0].src || product.images[0]
      const fromImages = resolveUrl(img)
      if (fromImages) return fromImages
    }
    
    return 'https://placehold.co/400'
  }

  return {
    getProductImage
  }
}
