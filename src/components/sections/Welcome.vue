<template>
    <div>
        {{ myName }}
    </div>
    <Bio>

    </Bio>

</template>

<script>
import Bio from './Bio.vue'

export default {
    name: "Welcome.vue",
    data() {
        return {
            myName: 'Eddyjim!'
        }
    }

}
</script>

<style scoped>

</style>