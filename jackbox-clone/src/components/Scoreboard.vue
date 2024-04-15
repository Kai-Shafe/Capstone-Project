<template>
  <div class="scoreboard">
    <h3>Scoreboard</h3>
    <ul>
      <li v-for="(score, player) in scores" :key="player">
        {{ player }}: {{ score }}
      </li>
    </ul>
  </div>
</template>

<script>
import { useNetworkStore } from '../stores/network-store'

export default {
  name: 'Scoreboard',
  computed: {
    scores() {
      return useNetworkStore().getScores;
    }
  }
}
</script>

<style scoped>
.scoreboard {
  margin-top: 20px;
}
</style>
