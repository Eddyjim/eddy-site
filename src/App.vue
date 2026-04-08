<script setup>

import Header from "@/components/sections/Header.vue";
import Footer from "@/components/sections/Footer.vue";

import NavigationMenu from "@/components/sections/navigation/NavigationBar.vue";

// bootstrap-icons CSS is now imported via main.scss

</script>

<template>
  <header>
    <Header/>
    <NavigationMenu/>
  </header>

  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
