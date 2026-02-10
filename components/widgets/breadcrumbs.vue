<template>
  <div class="breadcrumb-main">
    <div class="breadcrumb-section">
      <div class="container-fluid px-4">
        <div class="row">
          <div class="col-sm-6">
            
            <button @click="$router.back()" class="btn btn-sm back-button">
              <i class="ti-arrow-left"></i> BACK
            </button>
          </div>
          <div class="col-sm-6">
            <nav aria-label="breadcrumb" class="theme-breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <nuxt-link :to="{ path: '/' }">Home</nuxt-link>
                </li>
                <li class="breadcrumb-item active" v-if="title">{{ title }}</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title']
}
</script>
<style scoped>
.back-button {
  background-color: #ff6b35;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 8px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #ff5722;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 107, 53, 0.3);
}

.back-button i {
  margin-right: 4px;
}
</style>