// Client-only plugin: capture affiliate params and bind to product in sessionStorage
export default function () {
  if (process.client) {
    try {
      const params = new URLSearchParams(window.location.search);
      const af = params.get('af_id') || params.get('affiliateId') || params.get('af') || params.get('ref');
      const productId = params.get('id') || params.get('productId');
      if (af) {
        const normalized = String(af).toUpperCase();
        const mapKey = 'affiliateProductMap';
        let currentMap: Record<string, string> = {};
        try { currentMap = JSON.parse(sessionStorage.getItem(mapKey) || '{}'); } catch (_) { currentMap = {}; }
        if (productId) {
          currentMap[String(productId)] = normalized;
          sessionStorage.setItem(mapKey, JSON.stringify(currentMap));
          sessionStorage.setItem('affiliateStartTime', Date.now().toString());
          console.log(`🔗 Bound affiliate ${normalized} to product ${productId}`);
        } else {
          console.log('No product id in URL; not binding globally');
        }
      } else {
        console.log('No affiliate parameter found in URL');
      }
    } catch (e) {
      console.error('Affiliate plugin error:', e);
    }
  }
}
