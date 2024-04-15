<template>
  <tr>
    <td>{{ playerName }}</td>
  </tr>
    
  </template>
  
  <script>
  export default {
    name: 'PlayerList',
    props: {
      playerName: String
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  </style>
  