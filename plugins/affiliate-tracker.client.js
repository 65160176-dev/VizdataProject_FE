// Affiliate tracking plugin สำหรับจัดการ affiliate links
export default defineNuxtPlugin((nuxtApp) => {
  // ตรวจสอบ affiliate code จาก URL parameters เมื่อ app เริ่มต้น
  if (process.client) {
    const handleAffiliateTracking = () => {
      try {
        const url = new URL(window.location.href);
        const affiliateParam = url.searchParams.get('ref') || url.searchParams.get('affiliate');
        
        console.log('🔍 Checking for affiliate parameters in URL:', window.location.href);
        console.log('📋 Found affiliate code:', affiliateParam);
        
        if (affiliateParam) {
          // ตรวจสอบ affiliate code กับ backend
          verifyAndSetAffiliate(affiliateParam);
          
          // ลบ parameter ออกจาก URL เพื่อความสะอาด
          url.searchParams.delete('ref');
          url.searchParams.delete('affiliate');
          window.history.replaceState({}, '', url.toString());
          console.log('🧹 Cleaned URL:', url.toString());
        } else {
          console.log('❌ No affiliate code found in URL');
        }
      } catch (error) {
        console.error('Error handling affiliate tracking:', error);
      }
    };

    const verifyAndSetAffiliate = async (code) => {
      try {
        console.log(`🔄 Verifying affiliate code: ${code}`);
        
        // ตรวจสอบกับ backend ว่า affiliate code นี้ถูกต้องหรือไม่
        const normalized = String(code).toUpperCase();
        const response = await $fetch(`http://localhost:3001/api/affiliate/verify/${normalized}`);
        
        console.log('✅ Affiliate verification response:', response);
        
        if (response && response.valid) {
          // เก็บ affiliate code แบบ normalize ใน sessionStorage (ชั่วคราวเฉพาะ session นี้)
          sessionStorage.setItem('affiliateId', normalized);
          sessionStorage.setItem('affiliateStartTime', Date.now().toString());
          
          console.log(`🎯 Valid affiliate link detected: ${code}`);
          console.log(`👤 Affiliate: ${response.affiliate?.name || 'Unknown'}`);
          console.log(`💾 Stored in sessionStorage`);
          
          // แสดง notification หรือ toast (optional)
          if (window.$toast) {
            window.$toast.success(`มาจากลิงก์แนะนำของ ${response.affiliate?.name || 'Affiliate'}`);
          }
        } else {
          console.warn(`❌ Invalid affiliate code: ${code}`);
          console.warn('Response:', response);
        }
      } catch (error) {
        console.error('Error verifying affiliate code:', error);
      }
    };

    // ตรวจสอบเมื่อ app โหลดเสร็จ
    nuxtApp.hooks.hook('app:mounted', () => {
      console.log('🚀 App mounted - checking affiliate tracking');
      handleAffiliateTracking();
    });

    // ตรวจสอบเมื่อมีการ navigate ระหว่างหน้า
    nuxtApp.hooks.hook('page:finish', () => {
      console.log('📄 Page finished - checking affiliate tracking');
      handleAffiliateTracking();
    });
  }
});