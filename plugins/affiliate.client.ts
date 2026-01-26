// Client-only plugin: capture `af_id` query param and save to localStorage
export default function () {
  if (process.client) {
    try {
      const params = new URLSearchParams(window.location.search);
      const af = params.get('af_id') || params.get('affiliateId') || params.get('af');
      if (af) {
        localStorage.setItem('affiliateId', af);
        console.log(`🔗 Affiliate ID captured: ${af}`);
      } else {
        console.log('No affiliate parameter found in URL');
      }
    } catch (e) {
      console.error('Affiliate plugin error:', e);
    }
  }
}
