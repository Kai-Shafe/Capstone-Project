  <template>
    <div class="Home">
      <HeaderBar />
      <div v-if="networkStore.getCurrentState == 'none'">
        <input v-model="room_code" placeholder="Enter Room Code" />
        <input type="button" value="Submit" @click="join_game(room_code)" />
        <p>OR</p>
        <button @click="host_game">Host Game?</button>
      </div>
      <div v-else>
        <div v-if="networkStore.getCurrentState == 'joined'">
          <input v-model="username_input" placeholder="Enter Username" />
          <input type="button" value="Submit" @click="set_username(username_input)" />
        </div>
        <div v-else-if="networkStore.getCurrentState == 'waiting'">
          <p>Waiting for players</p>
          <input type="button" value="Everybody's In" @click="start_game()" />
        </div>
        <div v-else-if="networkStore.getCurrentState == 'answer-question'">
          <p>What is the capital of Brazil?</p>
          <input v-model="answer" placeholder="Enter lie" />
          <input type="button" value="Submit" @click="send_answer(answer)" />
        </div>
        <div v-else-if="networkStore.getCurrentState == 'answer-sent'">
          <p>What is the capital of Brazil?</p>
          <div class="answer-grid">
            <button class="button-answer">St.James</button>
            <button class="button-answer">Rolla</button>
            <button class="button-answer">Brasilia</button>
            <button class="button-answer">St.Louis</button>
            <button class="button-answer">Kansas City</button>
            <button class="button-answer">St.Roberts</button>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
  import HeaderBar from './header-bar.vue'
  import { useNetworkStore } from '../stores/network-store'

  export default {
    name: 'HomeScreen',
    components: {
      HeaderBar
    },
    data() {
      return {
        networkStore: useNetworkStore()
      }
    },
    props: {
      msg: String
    },
    methods: {
      host_game() {
        this.networkStore.host = true
      },
      join_game(roomCode) {
        this.networkStore.setRoomCode(roomCode)
      },
      set_username(usernameInput) {
        this.networkStore.setUsername(usernameInput)
      },
      start_game() {
        this.networkStore.startGame()
      },
      send_answer(answer) {
        this.networkStore.sendAnswer(answer)
      }
    }
  }


</script>
  

  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .Home {
    margin:0;
    height: 100vh;
  }
  .button-answer {
    background-color: #ffffff;
    border: 2px solid #2c3e50;
    border-radius: 30px;
    box-shadow: #2c3e50 4px 4px 0 0;
    color: #2c3e50;
    cursor: pointer;
    display: inline-block;
    font-weight: 600;
    font-size: 18px;
    line-height: 40px;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .button-answer:active {
    box-shadow: #2c3e50 2px 2px 0 0;
    transform: translate(2px, 2px);
  }

  @media (min-width: 768px) {
    .button-answer {
      min-width: 120px;
      padding: 0 25px;
    }
  }
  .answer-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  </style>
  