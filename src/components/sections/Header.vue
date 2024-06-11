<template>
  <div  class="header-icon">
    <img alt="Eddy Logo" class="logo" src="@/assets/logo.png" width="125" height="125" />
    <h1>Eddyjim</h1>
  </div>

</template>

<script>
export default {
    name: "header.vue"
}
</script>

<style scoped>

.logo {
  display: block;
  margin: auto auto auto auto;
}

.header-icon{
  display: flex;
  place-items: center;
  justify-content: center;
}

.header-icon h1 {
  font-size: 2rem;
}

.header-icon img {
  border-radius: 10%;
}



</style>