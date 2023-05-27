<template>
  <div id="all">
    <Map />
  </div>
</template>

<script>
import Map from "./components/Map.vue";

export default {
  components: { Map },
}
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
}

#all {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
