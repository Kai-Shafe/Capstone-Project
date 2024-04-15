<template>
  <HomeScreen/>
</template>

<script>
import HomeScreen from './components/home-screen.vue'

export default {
  name: 'App',
  components: {
    HomeScreen
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #CACACA;
}
</style>
