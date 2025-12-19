const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', 'data')
const productsPath = path.join(dataDir, 'products.json')
const sellersPath = path.join(dataDir, 'sellers.json')

function loadJson(p){
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function backup(filePath){
  const bak = filePath + '.bak'
  fs.copyFileSync(filePath, bak)
  console.log('Backup created:', bak)
}

function mapSellerId(){
  const productsData = loadJson(productsPath)
  const sellersData = loadJson(sellersPath)
  const sellers = sellersData.data || []
  const brandToId = {}
  sellers.forEach(s => { if(s.name) brandToId[s.name.toLowerCase()] = s.id })

  backup(productsPath)

  let updatedCount = 0
  const newProducts = (productsData.data || []).map(p => {
    const brand = (p.brand || '').toLowerCase()
    const sellerId = brandToId[brand]
    if(sellerId && p.seller_id !== sellerId){
      p.seller_id = sellerId
      updatedCount++
    }
    return p
  })

  productsData.data = newProducts
  fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2), 'utf8')
  console.log(`Updated seller_id for ${updatedCount} products.`)
}

if(require.main === module){
  try{
    mapSellerId()
  }catch(e){
    console.error('Failed:', e.message)
    process.exit(1)
  }
}

module.exports = { mapSellerId }
