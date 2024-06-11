<script setup>

import Header from "@/components/sections/Header.vue";
import Footer from "@/components/sections/Footer.vue";

import NavigationMenu from "@/components/sections/navigation/NavigationBar.vue";

import "bootstrap-icons/font/bootstrap-icons.css";

</script>

<template>
  <header>
    <Header/>
    <NavigationMenu/>
  </header>

  <main>
    <RouterView/>

  </main>

  <footer>
    <Footer/>
  </footer>
</template>

<style scoped>
header {
  grid-area: header;
  display: flex;
  justify-content: space-between;

}

main {
  grid-area: main;
}

footer {
  grid-area: footer;
}

.grid-container > * {
  padding: 1rem;
}
</style>
