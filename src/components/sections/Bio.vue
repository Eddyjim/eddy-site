<template>
    <div >
        <h1>{{ title }} </h1>
        <div >
            {{ description }}
        </div>
    </div>
</template>

<script>

export default {
    name: 'Bio.vue',
    data: function() {
        return {
            title: 'Bio',
            description: 'This is me!'
        }
    },
    created: function (){

    },
    mounted: function () {
    },
    computed: function (){

    }
}


</script>

<style scoped>

</style>