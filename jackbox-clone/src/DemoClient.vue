<template>
  <div>
    <div>
      <input type="text" v-model="answer" placeholder="Enter your answer">
      <button @click="submitAnswer">Submit</button>
    </div>
    <div>
      <ul>
        <li v-for="(answer, index) in compiledMessage.answers" :key="index">{{ answer }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      answer: '',
      compiledMessage: {},
      socket: null
    };
  },
  created() {
    this.socket = io('http://localhost:3000');

    this.socket.on('compiledMessage', (message) => {
      this.compiledMessage = message;
    });
  },
  methods: {
    submitAnswer() {
      if (this.answer.trim() !== '') {
        this.socket.emit('answer', this.answer.trim());
        this.answer = ''; // Clear the input box after submitting the answer
      }
    }
  }
};
</script>
