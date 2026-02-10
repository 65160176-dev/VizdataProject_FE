<template>
  <div class="affiliate-dashboard">
    
    <!-- Header Section -->
    <div class="page-header">
      <button @click="goBack" class="back-btn">
        <i class="fa fa-arrow-left"></i>
      </button>
      <div class="header-content">
        <h1 class="page-title">AFFILIATE DASHBOARD</h1>
        <p class="page-subtitle">จัดการและติดตามรายได้จากการแชร์สินค้าของคุณ</p>
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
      <div class="stat-card stat-total">
        <div class="stat-icon">
          <i class="fa fa-wallet"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ formatCurrency(totalIncome || 0) }}</h3>
          <p class="stat-label">รายได้ทั้งหมด(บาท)</p>
        </div>
      </div>
      
      <div class="stat-card stat-paid">
        <div class="stat-icon">
          <i class="fa fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ formatCurrency(summary?.paidCommission || 0) }}</h3>
          <p class="stat-label">ได้รับแล้ว(บาท)</p>
        </div>
      </div>
      
      <div class="stat-card stat-pending">
        <div class="stat-icon">
          <i class="fa fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ formatCurrency(summary?.pendingCommission || 0) }}</h3>
          <p class="stat-label">รอดำเนินการ</p>
        </div>
      </div>
      
      <div class="stat-card stat-orders">
        <div class="stat-icon">
          <i class="fa fa-shopping-cart"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ summary?.totalOrders || 0 }}</h3>
          <p class="stat-label">ยอดขายทั้งหมด(รายการ)</p>
        </div>
      </div>
    </div>

    <!-- Insights Section -->
    <div class="insights-section">
      <div class="section-header">
        <h3><i class="fa fa-chart-bar me-2"></i>สรุปค่าคอมยอดนิยม</h3>
      </div>
      <div class="insights-grid">
        <div class="insight-card">
          <div class="insight-header">
            <i class="fa fa-store"></i>
            <span>ร้านที่ได้ค่าคอมรวมทั้งหมดมากสุด (Top 5)</span>
          </div>
          <ul class="insight-list" v-if="topShopsLifetime.length">
            <li v-for="shop in topShopsLifetime" :key="shop.id" class="insight-item">
              <span class="insight-name">{{ shop.name }}</span>
              <span class="insight-value">{{ formatCurrency(shop.amount) }}</span>
            </li>
          </ul>
          <div v-else class="empty-insight">ไม่มีข้อมูล</div>
        </div>

        <div class="insight-card">
          <div class="insight-header">
            <i class="fa fa-box"></i>
            <span>สินค้าที่ให้ค่าคอมสูงสุด (Top 5)</span>
          </div>
          <ul class="insight-list" v-if="topProducts.length">
            <li v-for="p in topProducts" :key="p.id" class="insight-item">
              <span class="insight-name">{{ p.name }}</span>
              <span class="insight-value">{{ formatCurrency(p.amount) }}</span>
            </li>
          </ul>
          <div v-else class="empty-insight">ไม่มีข้อมูล</div>
        </div>
      </div>
    </div>

    <!-- Date Filter -->
    <div class="filter-section">
      <div class="filter-content">
        <div class="filter-header">
          <h4><i class="fa fa-filter me-2"></i>กรองตามช่วงวันที่</h4>
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
            ล้าง
          </button>
        </div>

        <div class="status-filters">
          <span class="status-filter-label">สถานะ:</span>
          <button :class="['status-chip', 'chip-all', statusFilter === 'all' ? 'active' : '']" @click="statusFilter = 'all'">ทั้งหมด</button>
          <button :class="['status-chip', 'chip-pending', statusFilter === 'pending' ? 'active' : '']" @click="statusFilter = 'pending'">รอดำเนินการ</button>
          <button :class="['status-chip', 'chip-paid', statusFilter === 'paid' ? 'active' : '']" @click="statusFilter = 'paid'">จ่ายแล้ว</button>
          <button :class="['status-chip', 'chip-cancelled', statusFilter === 'cancelled' ? 'active' : '']" @click="statusFilter = 'cancelled'">ยกเลิก</button>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="orders-section">
      <div class="section-header">
        <h3><i class="fa fa-list me-2"></i>รายการคำสั่งซื้อ</h3>
        <div class="header-actions">
          <span class="order-count">{{ filteredAffiliateData.length }} รายการ</span>
        </div>
      </div>
      
      <!-- Table Header -->
      <div class="orders-table-header" v-if="filteredAffiliateData.length > 0">
        <div class="th-order">รหัสออเดอร์</div>
        <div class="th-date">วันที่</div>
        <div class="th-product">สินค้า</div>
        <div class="th-price">ราคา</div>
        <div class="th-commission">คอมมิชชั่น</div>
        <div class="th-status">สถานะ</div>
      </div>
      
      <div class="orders-container" v-if="filteredAffiliateData.length > 0">
        <div class="order-row" v-for="(item, index) in filteredAffiliateData" :key="index">
          <div class="td-order">
            <span class="order-id-text">#{{ item.orderId }}</span>
          </div>
          <div class="td-date">
            <span>{{ formatDate(item.createdAt) }}</span>
          </div>
          <div class="td-product">
            <span class="product-name-text">{{ item.productName }}</span>
          </div>
          <div class="td-price">
            <span>{{ formatCurrency(item.price) }}</span>
          </div>
          <div class="td-commission">
            <span class="commission-value">{{ formatCurrency(item.commissionAmount) }}</span>
          </div>
          <div class="td-status">
            <span 
              :class="[
                'status-badge', 
                item.status === 'paid' ? 'status-paid' : 
                item.status === 'pending' ? 'status-pending' : 'status-cancelled'
              ]"
            >
              {{ translateStatus(item.status) }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <i class="fa fa-inbox"></i>
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
const rawOrders = ref([]) // เก็บข้อมูล AffiliateOrder ต้นฉบับ
const orderDetailsMap = ref(new Map()) // orderId -> order detail (มี seller)
const sellersMap = ref(new Map()) // sellerId -> display_name
const productMap = ref(new Map()) // productId -> {name, commission}
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
const statusFilter = ref('all')

// 2. ฟังก์ชันกรองข้อมูล (Computed)
// กรองตามวัน (สำหรับข้อมูลสรุป และใช้เป็นฐานให้ตาราง)
const dateOnlyAffiliateData = computed(() => {
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

// ตารางใช้ตัวกรองวัน + สถานะ
const filteredAffiliateData = computed(() => {
  const base = dateOnlyAffiliateData.value
  if (statusFilter.value === 'all') return base
  return base.filter(it => (it.status || '').toLowerCase() === statusFilter.value)
})

// 3. คำนวณรายได้ (รวม "จ่ายแล้ว" + "รอดำเนินการ" ไม่รวม "ยกเลิก")
// ไม่เปลี่ยนตามตัวกรองสถานะด้านล่าง ใช้เฉพาะตัวกรองวันที่
const totalIncome = computed(() => {
  return dateOnlyAffiliateData.value
    .filter(item => (item.status || '').toLowerCase() !== 'cancelled')
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
    rawOrders.value = data.orders || []
    
    // แปลงข้อมูล orders เป็น format ที่ใช้แสดงผล
    affiliateData.value = rawOrders.value.map(o => ({
      orderId: o.order?.orderId || '-',
      createdAt: o.createdAt,
      productName: o.items?.map(i => i.name).join(', ') || '-',
      category: '-', // ถ้ามีข้อมูล category ใน items ก็เอามาแสดง
      price: o.amount || 0,
      commissionAmount: o.commissionAmount || 0,
      status: o.status
    }))

    // ดึงข้อมูลเสริมสำหรับ Insight
    await enrichInsights()
  } catch (error) {
    console.error('Failed to load affiliate dashboard:', error)
    if (useNuxtApp().$showToast) {
      useNuxtApp().$showToast({ msg: 'ไม่สามารถโหลดข้อมูลได้', type: 'error' })
    }
  } finally {
    loading.value = false
  }
}

// ดึงข้อมูลเพื่อคำนวณ Top Shops / Top Products
const enrichInsights = async () => {
  try {
    // 1) ดึงรายละเอียด Order เพื่อหาตัว seller
    const ids = rawOrders.value.map((o) => o.order?._id || o.order)
      .filter(Boolean)
    const uniqueIds = Array.from(new Set(ids))
    const details = await Promise.all(uniqueIds.map(async (id) => {
      try {
        const res = await $fetch(`http://localhost:3001/api/order/${id}`)
        return res
      } catch (e) { return null }
    }))
    details.filter(Boolean).forEach((od) => {
      const key = od.orderId || od._id
      orderDetailsMap.value.set(key, od)
    })

    // 2) ดึงรายชื่อร้านค้าทั้งหมดไว้ Map
    try {
      const sellersRes = await $fetch('http://localhost:3001/api/sellers')
      const list = sellersRes?.data || sellersRes || []
      list.forEach((s) => {
        const name = s.display_name || s.name || 'ร้านค้า'
        const sid = s._id || s.id
        const uid = s.userId
        if (sid) sellersMap.value.set(String(sid), name)
        if (uid) sellersMap.value.set(String(uid), name)
      })
    } catch {}

    // 3) ดึงข้อมูลสินค้าเพื่อรู้ค่าคอมต่อชิ้น
    const productIds = rawOrders.value.flatMap((o) => (o.items || []).map((it) => it.productId)).filter(Boolean)
    const uniqueProductIds = Array.from(new Set(productIds))
    const productDetails = await Promise.all(uniqueProductIds.map(async (pid) => {
      try { return await $fetch(`http://localhost:3001/api/product/${pid}`) } catch { return null }
    }))
    productDetails.filter(Boolean).forEach((p) => {
      productMap.value.set(p._id || p.id, { name: p.name, commission: Number(p.commission || 0) })
    })
  } catch (e) {
    console.warn('enrichInsights error:', e)
  }
}

// Top Shops Lifetime (รวมทั้งหมดที่เคยแชร์ลิงก์ และจ่ายแล้วเท่านั้น)
const topShopsLifetime = computed(() => {
  const byShop = new Map()
  rawOrders.value.forEach((r) => {
    if ((r.status || '').toLowerCase() !== 'paid') return
    const keyById = r.order?._id || r.order
    const keyByOrderId = r.order?.orderId
    const od = orderDetailsMap.value.get(keyById) || orderDetailsMap.value.get(keyByOrderId)
    if (!od) return
    const sellerId = String(od.seller)
    const name = sellersMap.value.get(sellerId) || 'ร้านค้า'
    const prev = byShop.get(name) || 0
    byShop.set(name, prev + Number(r.commissionAmount || 0))
  })
  return Array.from(byShop.entries())
    .map(([name, amount]) => ({ id: name, name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
})

// Top Products (เฉพาะออเดอร์จ่ายแล้ว) รวมค่าคอมต่อสินค้า = commission% * price * qty (ไม่ปัดเศษ)
const topProducts = computed(() => {
  const totals = new Map()
  // map orderId -> raw order
  const rawByOrderId = new Map(rawOrders.value.map((r) => [r.order?.orderId || '-', r]))
  dateOnlyAffiliateData.value.forEach((v) => {
    if ((v.status || '').toLowerCase() !== 'paid') return
    const raw = rawByOrderId.get(v.orderId)
    if (!raw) return
    (raw.items || []).forEach((it) => {
      const info = productMap.value.get(it.productId)
      const commissionRate = info?.commission || 0
      const qty = Number(it.qty || 1)
      const itemPrice = Number(it.price || 0)
      // คำนวณ commission เป็น % ของราคา (ไม่ปัดเศษ)
      const amount = (itemPrice * qty * commissionRate) / 100
      const key = it.productId
      const prev = totals.get(key) || { id: key, name: info?.name || it.name || 'สินค้า', amount: 0 }
      prev.amount += amount
      prev.name = info?.name || prev.name
      totals.set(key, prev)
    })
  })
  return Array.from(totals.values()).sort((a, b) => b.amount - a.amount).slice(0, 5)
})

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
/* Base Styles */
.affiliate-dashboard {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #e64a19 0%, #ff5722 50%, #ff7043 100%);
  padding: 40px 40px;
  margin-bottom: 24px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Content wrapper for cards */
.affiliate-code-card,
.stats-grid,
.insights-section,
.filter-section,
.orders-section {
  margin-left: 24px;
  margin-right: 24px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 40px;
  height: 40px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.header-content {
  flex: 1;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  margin: 0;
}

/* Affiliate Code Card */
.affiliate-code-card {
  background: white;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.header-icon {
  width: 50px;
  height: 50px;
  background: #ff5722;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.header-text h3 {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ff5722;
}

.header-text p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.code-section {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 16px;
}

.code-display {
  flex: 1;
}

.code-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #718096;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.code-value {
  background: #fff3e0;
  border: 2px solid #ff5722;
  padding: 14px 20px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: 4px;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.copy-btn, .share-btn {
  background: #ff5722;
  border: none;
  color: white;
  padding: 14px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.copy-btn:hover, .share-btn:hover {
  background: #e64a19;
}

.share-dropdown {
  position: relative;
}

.share-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 150px;
  z-index: 1000;
  transform: translateY(8px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
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
  color: #2d3748;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
}

.share-option:last-child {
  border-bottom: none;
}

.share-option:hover {
  background: #f7fafc;
}

.usage-info {
  padding: 12px 16px;
  background: #fff3e0;
  border-left: 4px solid #ff5722;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000000;
  font-size: 0.9rem;
}

.info-item code {
  background: #ff5722;
  color: white;
  padding: 2px 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-total .stat-icon { background: #e53e3e; }
.stat-paid .stat-icon { background: #38a169; }
.stat-pending .stat-icon { background: #d69e2e; }
.stat-orders .stat-icon { background: #3182ce; }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 2px 0;
  color: #1a202c;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

/* Filter Section */
.filter-section {
  background: white;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.filter-header h4 {
  margin: 0 0 16px 0;
  color: #e64a19;
  font-weight: 700;
}

.date-inputs {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.date-input {
  flex: 1;
  min-width: 180px;
}

.date-input label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #718096;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.date-field {
  border: 1px solid #e2e8f0;
  padding: 10px 14px;
  font-size: 0.95rem;
  width: 100%;
  transition: border-color 0.2s ease;
}

.date-field:focus {
  border-color: #ff5722;
  outline: none;
}

.date-separator {
  padding-bottom: 10px;
  color: #a0aec0;
  font-size: 1rem;
}

.clear-btn {
  background: #fed7d7;
  color: #c53030;
  border: none;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #feb2b2;
}

.status-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.status-filter-label {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 8px;
}

.status-chip {
  background: #edf2f7;
  border: 1px solid #e2e8f0;
  color: #4a5568;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-chip:hover {
  background: #e2e8f0;
}

/* สีปุ่มทั้งหมด */
.status-chip.chip-all.active {
  background: #ff5722;
  border-color: #ff5722;
  color: white;
}

/* สีปุ่มรอดำเนินการ - เหลือง */
.status-chip.chip-pending.active {
  background: #f6e05e;
  border-color: #d69e2e;
  color: #744210;
}

/* สีปุ่มจ่ายแล้ว - เขียว */
.status-chip.chip-paid.active {
  background: #48bb78;
  border-color: #38a169;
  color: white;
}

/* สีปุ่มยกเลิก - แดง */
.status-chip.chip-cancelled.active {
  background: #f56565;
  border-color: #e53e3e;
  color: white;
}

/* Insights Section */
.insights-section {
  background: white;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.insight-card {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 16px;
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #e64a19;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.insight-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
}

.insight-name {
  color: #2d3748;
  font-weight: 600;
}

.insight-value {
  color: #38a169;
  font-weight: 700;
}

.empty-insight {
  color: #a0aec0;
  font-size: 0.9rem;
  text-align: center;
  padding: 20px;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.section-header h3 {
  margin: 0;
  color: #000000;
  font-weight: 700;
  font-size: 1.1rem;
}

.order-count {
  background: #ff5722;
  color: white;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Orders Section */
.orders-section {
  background: white;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.orders-table-header {
  display: grid;
  grid-template-columns: 120px 100px 1fr 100px 120px 100px;
  gap: 16px;
  padding: 12px 16px;
  background: #e64a19;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.orders-container {
  display: flex;
  flex-direction: column;
}

.order-row {
  display: grid;
  grid-template-columns: 120px 100px 1fr 100px 120px 100px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  transition: all 0.2s ease;
}

.order-row:hover {
  background: #f7fafc;
}

.order-row:last-child {
  border-bottom: none;
}

.order-id-text {
  font-weight: 600;
  color: #ff5722;
  font-size: 0.9rem;
}

.td-date {
  color: #718096;
  font-size: 0.9rem;
}

.td-product {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name-text {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.category-tag {
  display: inline-block;
  background: #edf2f7;
  color: #4a5568;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
}

.td-price {
  font-weight: 600;
  color: #2d3748;
}

.td-commission .commission-value {
  font-weight: 700;
  color: #38a169;
  font-size: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
}

.status-paid {
  background: #c6f6d5;
  color: #276749;
}

.status-pending {
  background: #fefcbf;
  color: #975a16;
}

.status-cancelled {
  background: #fed7d7;
  color: #c53030;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 70px;
  height: 70px;
  background: #edf2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  font-size: 28px;
  color: #a0aec0;
}

.empty-state h4 {
  color: #2d3748;
  margin-bottom: 8px;
  font-weight: 600;
}

.empty-state p {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .orders-table-header {
    display: none;
  }
  
  .order-row {
    display: flex;
    flex-wrap: wrap;
    padding: 16px;
    border: 1px solid #e2e8f0;
    margin-bottom: 12px;
  }
  
  .td-order, .td-date {
    width: 50%;
  }
  
  .td-product {
    width: 100%;
    margin: 8px 0;
  }
  
  .td-price, .td-commission, .td-status {
    width: 33.33%;
  }
}

@media (max-width: 768px) {
  .affiliate-dashboard {
    padding: 10px;
  }

  .page-header {
    padding: 30px 20px;
    flex-direction: column;
    gap: 16px;
  }

  .back-btn {
    position: absolute;
    left: 20px;
    top: 20px;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }

  .code-section {
    flex-direction: column;
    gap: 12px;
  }

  .action-buttons {
    width: 100%;
    justify-content: stretch;
  }
  
  .copy-btn, .share-btn {
    flex: 1;
    justify-content: center;
  }

  .date-inputs {
    flex-direction: column;
    gap: 12px;
  }

  .date-input {
    min-width: auto;
    width: 100%;
  }
  
  .date-separator {
    display: none;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .status-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .status-chip {
    width: 100%;
    text-align: center;
  }
}
</style>