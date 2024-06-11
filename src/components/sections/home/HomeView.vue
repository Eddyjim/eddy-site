<template>
  <Bio />

</template>

<script>

import Header from '@/components/sections/Header.vue'
import Bio from '@/components/sections/home/Bio.vue'

export default {
  name: "HomeView",
  components: {Header, Bio},
  data() {
    return {
      myName: '!'
    }
  }

}
</script>

<style scoped>

</style>