  <template>
    <div class="Home">
      <HeaderBar />
      <div v-if="networkStore.getCurrentState == 'none'">
        <input v-model="username_input" placeholder="Enter Username" />
        <input type="button" value="Submit" @click="set_username(username_input)" />
      </div>
      <div v-else>
        <div v-if="networkStore.getCurrentState == 'hostOrJoin'">
          <input v-model="room_code" placeholder="Enter Room Code" />
          <input type="button" value="Submit" @click="join_game(room_code)" />
          <p>OR</p>
          <button @click="host_game()">Host Game?</button>
        </div>
        <div v-else-if="networkStore.getCurrentState == 'waiting'">
          <p>Room Code:</p>
          <p><b>{{ this.networkStore.roomCode }}</b></p>
          <div v-if="this.networkStore.host == false">
            <p>Waiting for host to start...</p>
          </div>
          <div v-if="this.networkStore.host == true">
            <table class="player-list">
              <tr>
                <th>Players</th>
              </tr>
              <PlayerList v-for="username in getPlayersArray()" 
              :key="username"
              :playerName="username"
              />
            </table>
            <ButtonAnswer @click="start_game()" answer="Everybody's In"/>
          </div>
        </div>
        <div v-else-if="networkStore.getCurrentState == 'answer-question'">
          <p>{{this.networkStore.currentQuestion}}</p>
          <input v-model="answer" placeholder="Enter lie" />
          <input type="button" value="Submit" @click="send_answer(answer)" />
          <TimerBar :widthTimer="this.networkStore.clockTimer"/>
        </div>
        <div v-else-if="networkStore.getCurrentState == 'answer-sent'">
          <p>{{this.networkStore.currentQuestion}}</p>
          <p>Waiting for other players to submit an answer...</p>
        </div>
        <div v-else-if="networkStore.getCurrentState == 'show-answers'">
          <p>{{this.networkStore.currentQuestion}}</p>
          <div class="answer-grid">
            <ButtonAnswer 
              v-for="answer in getAnswersArray()" 
              :key="answer"
              :answer="answer"
              @click="select_answer(answer)"
            />
          </div>
          <TimerBar :widthTimer="this.networkStore.clockTimer"/>
          <input type="button" value="add answer (test function)" @click="add_test_answer()" />
        </div>
        <div v-else-if="networkStore.getCurrentState == 'answer-selected'">
          <p>{{this.networkStore.currentQuestion}}</p>
          <p>Waiting for other players to select an answer...</p>
        </div>
        <div v-else-if="networkStore.getCurrentState == 'show-correct-answer'">
          <p>{{this.networkStore.currentQuestion}}</p>
          
        </div>
      </div>
    </div>
  </template>

<script>
  import HeaderBar from './header-bar.vue'
  import ButtonAnswer from './button-answer.vue'
  import PlayerList from './player-list.vue'
  import TimerBar from './timer-bar.vue'
  import { useNetworkStore } from '../stores/network-store'

  export default {
    name: 'HomeScreen',
    components: {
      HeaderBar,
      ButtonAnswer,
      PlayerList,
      TimerBar
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
        this.networkStore.hostGame()
      },
      join_game(roomCode) {
        this.networkStore.joinGame(roomCode)
      },
      set_username(usernameInput) {
        this.networkStore.setUsername(usernameInput)
      },
      start_game() {
        this.networkStore.startGame()
      },
      send_answer(answer) {
        this.networkStore.sendAnswer(answer)
      },
      add_test_answer() {
        this.networkStore.answers.push("test")
      },
      select_answer(answer) {
        this.networkStore.selectAnswer(answer)
      },
      getAnswersArray() {
      return Array.from(this.networkStore.answers.values())
      },
      getPlayersArray() {
        return Array.from(this.networkStore.players)
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
  .player-list {
    margin: 5%;
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
  