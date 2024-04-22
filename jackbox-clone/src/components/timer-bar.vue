<template>
    <div id="barWrapper">
        <div id="myProgress">
            <div id="myBar"></div>
        </div>
    </div>
    
  </template>
  
  <script>
  export default {
    name: 'TimerBar',
    props: {
      widthTimer: 1
    },
    methods: {
        getPercent(num) {
            return parseFloat(num).toFixed(0) + "%"
        }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    #barWrapper {
        margin: 5%;
        border: 2px solid #000000;
        border-radius: 20px;
    }

    #myProgress {
        width: 100%;
        background-color: #ddd;
        border-radius: 20px;
    }

    #myBar {
        width: v-bind("getPercent(widthTimer)");
        height: 30px;
        background-color: #2cb0c2;
        border-radius: 20px;
    }
  </style>
  