<template>
  <div>
    <div v-if="!selectedAnswer">
      <ul>
        <li v-for="(answer, index) in compiledMessage.answers" :key="index">
          <button @click="selectAnswer(answer)">{{ answer }}</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>You selected: {{ selectedAnswer }}</p>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      selectedAnswer: '',
      compiledMessage: {},
      socket: null
    };
  },
  created() {
    this.socket = io('http://localhost:3000');

    this.socket.on('compiledMessage', (message) => {
      this.compiledMessage = message;
    });

    this.socket.on('promptForCorrectAnswer', () => {
      // Handle prompt for selecting the correct answer
      // Display buttons to allow the user to select the correct answer
    });
  },
  methods: {
    selectAnswer(answer) {
      this.selectedAnswer = answer;
      this.socket.emit('selectCorrectAnswer', answer);
    }
  }
};
</script>
