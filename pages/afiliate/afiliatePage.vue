<template>
  <div class="affiliate-dashboard">
    
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <button @click="goBack" class="back-btn">
          <i class="fa fa-arrow-left"></i>
        </button>
        
        <div class="hero-text">
          <h1 class="hero-title">💼 Affiliate Dashboard</h1>
          <p class="hero-subtitle">จัดการและติดตามรายได้จากการแชร์สินค้าของคุณ</p>
        </div>
      </div>
      
      <div class="hero-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>

    <!-- Affiliate Code Card -->
    <div class="affiliate-code-card" v-if="affiliateInfo">
      <div class="card-header">
        <div class="header-icon">
          <i class="fa fa-link"></i>
        </div>
        <div class="header-text">
          <h3>รหัส Affiliate ของคุณ</h3>
          <p>นำไปใช้ในการแชร์สินค้าเพื่อรับค่าคอมมิชชั่น</p>
        </div>
      </div>
      
      <div class="code-section">
        <div class="code-display">
          <span class="code-label">Affiliate Code</span>
          <div class="code-value">{{ affiliateInfo.code }}</div>
        </div>
        
        <div class="action-buttons">
          <button @click="copyAffiliateLink" class="copy-btn">
            <i class="fa fa-copy"></i>
            <span>Copy Link</span>
          </button>
          
          <div class="share-dropdown">
            <button class="share-btn">
              <i class="fa fa-share-alt"></i>
              <span>แชร์</span>
            </button>
            <div class="share-menu">
              <button @click="shareAffiliateLink('line')" class="share-option">
                <i class="fa fa-comment"></i> LINE
              </button>
              <button @click="shareAffiliateLink('facebook')" class="share-option">
                <i class="fa fa-facebook"></i> Facebook
              </button>
              <button @click="shareAffiliateLink('twitter')" class="share-option">
                <i class="fa fa-twitter"></i> Twitter
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="usage-info">
        <div class="info-item">
          <i class="fa fa-info-circle"></i>
          <span>แชร์ลิงก์หลัก หรือเพิ่ม <code>?ref={{ affiliateInfo.code }}</code> ท้าย URL หน้าไหนก็ได้</span>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">
          <i class="fa fa-money-bill-wave"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ formatCurrency(summary?.totalCommission || 0) }}</h3>
          <p class="stat-label">รายได้ทั้งหมด</p>
        </div>
      </div>
      
      <div class="stat-card success">
        <div class="stat-icon">
          <i class="fa fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ formatCurrency(summary?.paidCommission || 0) }}</h3>
          <p class="stat-label">ได้รับแล้ว</p>
        </div>
      </div>
      
      <div class="stat-card warning">
        <div class="stat-icon">
          <i class="fa fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ formatCurrency(summary?.pendingCommission || 0) }}</h3>
          <p class="stat-label">รอดำเนินการ</p>
        </div>
      </div>
      
      <div class="stat-card info">
        <div class="stat-icon">
          <i class="fa fa-shopping-bag"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ summary?.totalOrders || 0 }}</h3>
          <p class="stat-label">ยอดขายทั้งหมด</p>
        </div>
      </div>
    </div>

    <!-- Date Filter -->
    <div class="filter-section">
      <div class="filter-content">
        <div class="filter-header">
          <h4><i class="fa fa-calendar-alt me-2"></i>กรองตามช่วงวันที่</h4>
        </div>
        
        <div class="date-inputs">
          <div class="date-input">
            <label>วันที่เริ่มต้น</label>
            <input type="date" v-model="startDate" class="date-field">
          </div>
          
          <div class="date-separator">
            <i class="fa fa-arrow-right"></i>
          </div>
          
          <div class="date-input">
            <label>วันที่สิ้นสุด</label>
            <input type="date" v-model="endDate" class="date-field">
          </div>
          
          <button v-if="startDate || endDate" @click="clearDate" class="clear-btn">
            <i class="fa fa-times"></i>
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="orders-section">
      <div class="section-header">
        <h3><i class="fa fa-list-alt me-2"></i>รายการคำสั่งซื้อ</h3>
        <div class="header-actions">
          <span class="order-count">{{ filteredAffiliateData.length }} รายการ</span>
        </div>
      </div>
      
      <div class="orders-container" v-if="filteredAffiliateData.length > 0">
        <div class="order-item" v-for="(item, index) in filteredAffiliateData" :key="index">
          <div class="order-main">
            <div class="order-info">
              <div class="order-id">
                <i class="fa fa-hashtag"></i>
                <span>{{ item.orderId }}</span>
              </div>
              <div class="order-date">
                <i class="fa fa-calendar"></i>
                <span>{{ formatDate(item.createdAt) }}</span>
              </div>
            </div>
            
            <div class="product-info">
              <h5 class="product-name">{{ item.productName }}</h5>
              <div class="product-details">
                <span class="category-tag">{{ item.category || 'ไม่ระบุหมวดหมู่' }}</span>
                <span class="price">{{ formatCurrency(item.price) }}</span>
              </div>
            </div>
          </div>
          
          <div class="order-stats">
            <div class="commission">
              <span class="commission-label">คอมมิชชั่น</span>
              <span class="commission-value">{{ formatCurrency(item.commissionAmount) }}</span>
            </div>
            
            <div class="status">
              <span 
                :class="[
                  'status-badge', 
                  item.status === 'paid' ? 'status-paid' : 
                  item.status === 'pending' ? 'status-pending' : 'status-cancelled'
                ]"
              >
                <i :class="[
                  'fa', 
                  item.status === 'paid' ? 'fa-check-circle' : 
                  item.status === 'pending' ? 'fa-clock' : 'fa-times-circle'
                ]"></i>
                {{ translateStatus(item.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <i class="fa fa-shopping-bag"></i>
        </div>
        <h4>ยังไม่มีรายการขาย</h4>
        <p>เมื่อมีลูกค้าซื้อสินค้าผ่านลิงก์ Affiliate ของคุณ จะแสดงที่นี่</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { affiliateService } from "~/services/affiliate.service"
import { useAuthStore } from "~/store/auth"
import { useRouter } from "vue-router"

definePageMeta({ 
  layout: "default",
  middleware: "auth"
})

const authStore = useAuthStore()
const router = useRouter()

const affiliateData = ref([])
const affiliateInfo = ref(null)
const summary = ref({
  totalOrders: 0,
  totalCommission: 0,
  pendingCommission: 0,
  paidCommission: 0
})
const loading = ref(true)

// 1. สร้างตัวแปรเก็บวันที่
const startDate = ref('')
const endDate = ref('')

// 2. ฟังก์ชันกรองข้อมูล (Computed)
const filteredAffiliateData = computed(() => {
  return affiliateData.value.filter(item => {
    // ถ้ายังไม่ได้เลือกวันที่เลย ให้แสดงทั้งหมด
    if (!startDate.value && !endDate.value) return true
    
    // แปลงวันที่เพื่อเปรียบเทียบ
    const itemDate = new Date(item.createdAt)
    const start = startDate.value ? new Date(startDate.value) : null
    const end = endDate.value ? new Date(endDate.value) : null

    // ปรับให้ start เป็นต้นวัน และ end เป็นปลายวัน เพื่อไม่ตัดคำสั่งซื้อในวันเดียวกัน
    if (start) start.setHours(0, 0, 0, 0)
    if (end) end.setHours(23, 59, 59, 999)

    // กรองตามเงื่อนไข
    if (start && itemDate < start) return false
    if (end && itemDate > end) return false
    
    return true
  })
})

// 3. คำนวณรายได้ (แก้ให้คำนวณจากข้อมูลที่กรองแล้ว)
const totalIncome = computed(() => {
  return filteredAffiliateData.value
    .filter(item => item.status === 'paid') 
    .reduce((sum, item) => sum + Number(item.commissionAmount || 0), 0)
})

const clearDate = () => {
    startDate.value = ''
    endDate.value = ''
}

// ฟอร์แมตตัวเลข (เหมือนเดิม)
const formatNumber = (value) => {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(value);
}

// ฟอร์แมตสกุลเงิน (เหมือนเดิม)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: 'THB',
    minimumFractionDigits: 0 
  }).format(value);
}

// แปลง status
const translateStatus = (status) => {
  const statusMap = {
    pending: 'รอดำเนินการ',
    paid: 'จ่ายแล้ว',
    cancelled: 'ยกเลิก'
  }
  return statusMap[status] || status
}

// แปลงวันที่
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// ดึงข้อมูลจาก API
const fetchDashboard = async () => {
  try {
    loading.value = true
    
    // middleware จะจัดการ auth แล้ว เอาแค่ userId
    const userId = authStore.user?._id || authStore.user?.id
    if (!userId) {
      console.log('No user found, redirecting to login')
      router.push('/page/auth/LoginPage')
      return
    }

    console.log('Fetching dashboard for user:', userId)
    const data = await affiliateService.getDashboard(userId)
    affiliateInfo.value = data.affiliate
    summary.value = data.summary
    
    // แปลงข้อมูล orders เป็น format ที่ใช้แสดงผล
    affiliateData.value = data.orders.map(o => ({
      orderId: o.order?.orderId || '-',
      createdAt: o.createdAt,
      productName: o.items?.map(i => i.name).join(', ') || '-',
      category: '-', // ถ้ามีข้อมูล category ใน items ก็เอามาแสดง
      price: o.amount || 0,
      commissionAmount: o.commissionAmount || 0,
      status: o.status
    }))
  } catch (error) {
    console.error('Failed to load affiliate dashboard:', error)
    if (useNuxtApp().$showToast) {
      useNuxtApp().$showToast({ msg: 'ไม่สามารถโหลดข้อมูลได้', type: 'error' })
    }
  } finally {
    loading.value = false
  }
}

// คัดลอก Affiliate Link
const copyAffiliateLink = () => {
  if (!affiliateInfo.value) return
  
  const baseUrl = window.location.origin
  const sampleLink = `${baseUrl}/?ref=${affiliateInfo.value.code}`
  
  navigator.clipboard.writeText(sampleLink).then(() => {
    if (useNuxtApp().$showToast) {
      useNuxtApp().$showToast({ 
        msg: `คัดลอกลิงก์แล้ว! ใช้ลิงก์นี้: ${sampleLink}`, 
        type: 'success' 
      })
    }
  }).catch(err => {
    console.error('Failed to copy:', err)
  })
}

// สร้าง affiliate link สำหรับสินค้าเฉพาะ
const generateProductAffiliateLink = (productId) => {
  if (!affiliateInfo.value) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/product/three-column/thumbnail-left?id=${productId}&ref=${affiliateInfo.value.code}`
}

// แชร์ affiliate link ผ่าน social media
const shareAffiliateLink = (platform) => {
  const baseUrl = window.location.origin
  const affiliateLink = `${baseUrl}/?ref=${affiliateInfo.value.code}`
  const message = `เช็คสินค้าเจ๋งๆ ได้ที่นี่เลย! ${affiliateLink}`
  
  let shareUrl = ''
  switch(platform) {
    case 'line':
      shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(affiliateLink)}`
      break
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}`
      break
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
      break
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }
}

// ปุ่มย้อนกลับ
const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
.affiliate-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #ff4c3b 0%, #ff6b3b 100%);
  border-radius: 24px;
  padding: 60px 40px;
  margin-bottom: 40px;
  overflow: hidden;
  color: white;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.back-btn {
  position: absolute;
  top: -40px;
  left: -20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.hero-text {
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.hero-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  right: 50px;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: -50px;
}

/* Affiliate Code Card */
.affiliate-code-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f4;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff4c3b, #ff6b3b);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.header-text h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333333;
}

.header-text p {
  margin: 0;
  color: #777777;
  font-size: 0.95rem;
}

.code-section {
  display: flex;
  align-items: end;
  gap: 20px;
  margin-bottom: 20px;
}

.code-display {
  flex: 1;
}

.code-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #777777;
  margin-bottom: 8px;
}

.code-value {
  background: #f9f9f9;
  border: 2px solid #dddddd;
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff4c3b;
  letter-spacing: 3px;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.copy-btn, .share-btn {
  background: linear-gradient(135deg, #ff4c3b, #ff6b3b);
  border: none;
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
  transition: all 0.3s ease;
}

.copy-btn:hover, .share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 76, 59, 0.4);
}

.share-dropdown {
  position: relative;
}

.share-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  min-width: 150px;
  overflow: hidden;
  z-index: 1000;
  transform: translateY(8px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.share-dropdown:hover .share-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(4px);
}

.share-option {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;
  color: #333;
  font-weight: 500;
}

.share-option:hover {
  background-color: #f8f9fa;
}

.share-option i {
  width: 20px;
  text-align: center;
}

.usage-info {
  padding: 16px 20px;
  background: #f7f7f7;
  border-radius: 12px;
  border-left: 4px solid #ff4c3b;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333333;
  font-size: 0.9rem;
}

.info-item code {
  background: #eeeeee;
  color: #ff4c3b;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f4;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #ff4c3b, #ff6b3b);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #ffa200, #fd7e14);
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #17a2b8, #6f42c1);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 4px 0;
  color: #333333;
}

.stat-label {
  font-size: 0.9rem;
  color: #777777;
  margin: 0;
  font-weight: 500;
}

/* Filter Section */
.filter-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f4;
}

.filter-header h4 {
  margin: 0 0 20px 0;
  color: #333333;
  font-weight: 700;
}

.date-inputs {
  display: flex;
  align-items: end;
  gap: 16px;
  flex-wrap: wrap;
}

.date-input {
  flex: 1;
  min-width: 200px;
}

.date-input label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #777777;
  margin-bottom: 6px;
}

.date-field {
  border: 2px solid #dddddd;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.95rem;
  width: 100%;
  transition: border-color 0.3s ease;
}

.date-field:focus {
  border-color: #ff4c3b;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 76, 59, 0.1);
}

.date-separator {
  padding-bottom: 12px;
  color: #a1a1a1;
  font-size: 1.2rem;
}

.clear-btn {
  background: #fed7d7;
  color: #dc3545;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #ffc5c5;
}

/* Orders Section */
.orders-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f4;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f9f9f9;
}

.section-header h3 {
  margin: 0;
  color: #333333;
  font-weight: 700;
}

.order-count {
  background: #eeeeee;
  color: #333333;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.orders-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid #dddddd;
}

.order-item:hover {
  background: #f5f2f2;
  transform: translateX(4px);
  border-color: #ff4c3b;
}

.order-main {
  display: flex;
  gap: 20px;
  flex: 1;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.order-id,
.order-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #777777;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
}

.product-details {
  display: flex;
  gap: 12px;
  align-items: center;
}

.category-tag {
  background: #eeeeee;
  color: #333333;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.price {
  font-weight: 600;
  color: #333333;
}

.order-stats {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 12px;
  min-width: 150px;
}

.commission {
  text-align: right;
}

.commission-label {
  display: block;
  font-size: 0.8rem;
  color: #777777;
  margin-bottom: 4px;
}

.commission-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #28a745;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-paid {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #f7f7f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  font-size: 32px;
  color: #a1a1a1;
}

.empty-state h4 {
  color: #333333;
  margin-bottom: 12px;
}

.empty-state p {
  color: #777777;
  margin: 0;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .affiliate-dashboard {
    padding: 0 10px;
  }

  .hero-section {
    padding: 40px 20px;
    margin-bottom: 20px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .order-item {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .order-main {
    flex-direction: column;
    gap: 12px;
  }

  .order-stats {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .code-section {
    flex-direction: column;
    gap: 16px;
  }

  .copy-btn {
    width: 100%;
  }

  .date-inputs {
    flex-direction: column;
    gap: 12px;
  }

  .date-input {
    min-width: auto;
  }
}
</style>