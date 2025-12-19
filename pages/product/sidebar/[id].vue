<template>
  <div />
</template>

<script>
export default {
  mounted() {
    const id = this.$route && this.$route.params && this.$route.params.id
    this.$router.replace({ path: '/product/three-column/thumbnail-left', query: { id } })
  }
}
</script>
