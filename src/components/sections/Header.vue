<script setup>
</script>

<template>
  <div class="header-icon">
    <RouterLink to="/" class="d-flex align-items-center gap-3 text-decoration-none">
      <img alt="Eddy Logo" class="logo" src="@/assets/logo.png" width="48" height="48" />
      <span class="site-name fw-bold">Eddyjim</span>
    </RouterLink>
  </div>
</template>

<style scoped>
.header-icon {
  display: flex;
  align-items: center;
}

.logo {
  border-radius: 12px;
}

.site-name {
  font-size: 1.25rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}
</style>
