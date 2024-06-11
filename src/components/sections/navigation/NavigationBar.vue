<template>
  <div class="sidebar navbar">
    <p><RouterLink to="/">Home</RouterLink></p>
    <p><RouterLink to="/techie">Tech Profile</RouterLink></p>
    <p><RouterLink to="/contact">Contact Me</RouterLink></p>
  </div>
</template>

<script>
export default {
  name: "NavigationBar"
}
</script>

<style scoped>
.sidebar {
  flex-basis: 40%;
  display: flex;
  align-content: center;
  justify-content: flex-end;
  flex-direction: row;
  background-color: #f5f5f5;
  height: 40px;
}

.sidebar p {
  font-size: large;
  padding: 10px;
  margin: 0;
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
