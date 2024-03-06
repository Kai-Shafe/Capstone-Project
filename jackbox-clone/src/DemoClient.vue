<template>
    <div>
      <input type="text" v-model="message" placeholder="Enter a message">
      <button @click="sendMessage">Send</button>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  
  export default {
    data() {
      return {
        message: '',
      };
    },
    mounted() {
      this.socket = io('http://localhost:3000');
  
      this.socket.on('response', (data) => {
        console.log('Received response from server:', data);
      });
    },
    methods: {
      sendMessage() {
        this.socket.emit('message', this.message);
      },
    },
  };
  </script>
  