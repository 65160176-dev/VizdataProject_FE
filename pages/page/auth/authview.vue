<template>
    <router-view />
</template>
<script setup>
// empty script so per-file auth styles can be appended below
</script>
<style scoped lang="scss">
/* General auth container styles (copied from globals) */
.authentication-box { min-width: 100vw; min-height: 100vh; width: auto; height: auto; display: flex; align-items: center; justify-content: center; }
.authentication-box .form-footer .social li a { text-decoration: none !important; }

@media only screen and (max-width: 991px) {
    .authentication-box { padding: 30px; }
}
</style>