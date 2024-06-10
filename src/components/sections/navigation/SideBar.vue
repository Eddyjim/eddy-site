<template>
  <div class="sidebar">
    <ul>
      <li><a>
        <RouterLink to="/">Home</RouterLink>
      </a></li>
      <li>
        <RouterLink to="/contact">Contact</RouterLink>
      </li>
      <li>
        <RouterLink to="/techie">Techie</RouterLink>
      </li>

    </ul>
  </div>
</template>

<script>
export default {
  name: "SideBar.vue"
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #f5f5f5;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  padding: 10px;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
}
</style>
