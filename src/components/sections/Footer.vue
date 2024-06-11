<template xmlns="http://www.w3.org/1999/html">

  <div class="footer">

    <div class="social">
      <p> You can find me in </p>
      <i class="bi bi-github"></i>
      <i class="bi bi-linkedin" />
      <i class="bi bi-facebook"></i>
      <i class="bi bi-twitter-x"></i>
    </div>
    <br/>
    <div class="notes">
      <p> Eddyjim &copy; 2024 </p>
    </div>

  </div>

</template>

<script>
export default {
    name: "Footer"
}
</script>

<style scoped>

.footer {
  width: 100%;
  background-color: #333333;
}

.footer p {
  font-size: 1rem;
}

.footer .notes {
  display: flex;
  justify-content: center;
  align-items: center;
}

.social {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 10px;
}

</style>