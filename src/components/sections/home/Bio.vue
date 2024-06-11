<template>
  <div class="bio">
    <h1>{{ title }}</h1>
    <div class="bio-text" v-html="markdownToHtml"></div>
  </div>

</template>

<script>

import {marked} from "marked";

export default {
  name: 'Bio',
  data: function () {
    return {
      title: "Bio",
      description: ""
    }
  },
  created: function () {

  },
  mounted: function () {
    self = this;
    fetch("/content/BIO.md")
        .then(response => response.text())
        .then(text => {
          self.description = text;
        });
  },
  computed: {
    markdownToHtml: function () {
      return marked(this.description);
    }
  }
}


</script>

<style scoped>

.bio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  margin: 20px;
  width: 80%;
}

.bio h1 {
  font-size: 2rem;
  ;
}

.bio-text {
  margin-top: 20px;
  font-size: 1.2rem;
}

</style>