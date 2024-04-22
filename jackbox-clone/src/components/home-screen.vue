  <template>
    <div class="Home">
      <HeaderBar />
      <div class="form__group field" v-if="networkStore.getCurrentState == 'none'">
        <input id="username" class="form__field" v-model="username_input" placeholder="Enter Username" />
        <label for="username" class="form__label">Username</label>
        <ButtonAnswer style="margin-top: 50px" @click="set_username(username_input)" answer="Submit"/>
      </div>
      <div v-else>
        <div class="form__group field" v-if="networkStore.getCurrentState == 'hostOrJoin'">
          <input id="enterRoomCode" class="form__field" v-model="room_code" placeholder="Enter Room Code" />
          <label for="enterRoomCode" class="form__label">Enter Room Code</label>
          <ButtonAnswer style="margin-top: 10px" @click="join_game(room_code)" answer="Join Game"/>
          <p>OR</p>
          <ButtonAnswer @click="host_game()" answer="Host Game?"/>
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
            <ButtonAnswer @click="start_round()" answer="Everybody's In"/>
          </div>
        </div>
        <div v-else-if="networkStore.getCurrentState == 'answer-question'">
          <p>{{this.networkStore.currentQuestion}}</p>
          <div class="form__group field">
            <input id="enterLie" class="form__field" v-model="answer" placeholder="Enter lie" />
            <label for="enterLie" class="form__label">Enter A Lie</label>
            <ButtonAnswer style="margin-top: 10px" @click="send_answer(answer)" answer="Submit"/>
          </div>
          
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
        </div>
        <div v-else-if="networkStore.getCurrentState == 'answer-selected'">
          <p>{{this.networkStore.currentQuestion}}</p>
          <p>Waiting for other players to select an answer...</p>
          <div class="answer-grid">
            <ButtonAnswer
              v-for="answer in getAnswersArray()"
              :key="answer"
              :answer="answer"
              :disabled="networkStore.getCurrentState!=='answer-selected'"
            />
          </div>
        </div>
        <div v-else-if="networkStore.getCurrentState == 'show-correct-answer'">
          <p>{{this.networkStore.currentQuestion}}</p>
          <div class="answer-grid">
            <ButtonAnswer
              v-for="answer in getAnswersArray()"
              :key="answer"
              :answer="answer"
              :class="{
                'correct-answer': answer===networkStore.currentCorrectAnswer,
                'incorrect-answer': answer!==networkStore.currentCorrectAnswer
              }"
            />
          </div>
          <p>Scores: </p>
          <div v-for="player in getPlayersArray()" :key="player">
            <p>{{ player }}: {{ networkStore.points.get(player) }}</p>
          </div>
          <div v-if="networkStore.host == true">
            <ButtonAnswer answer="Next round" @click="start_round()" />
          </div>
          <div v-else>
            <p>Waiting for host to begin the next round</p>
          </div>
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
      start_round() {
        this.networkStore.startRound()
      },
      send_answer(answer) {
        this.networkStore.sendAnswer(answer)
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
  .form__group {
    position: relative;
    padding: 15px 0 0;
    margin-left: 5%;
    margin-right: 5%;
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #2c3e50;
    outline: 0;
    font-size: 1.3rem;
    color: #2c3e50;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;

    &::placeholder {
      color: transparent;
    }

    &:placeholder-shown ~ .form__label {
      font-size: 1.3rem;
      cursor: text;
      top: 20px;
    }
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: #2c3e50;
  }

  .form__field:focus {
    ~ .form__label {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 1rem;
      color: primary;
      font-weight:700;    
    }
    padding-bottom: 6px;  
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, primary,secondary);
    border-image-slice: 1;
  }
  /* reset input */
  .form__field{
    &:required,&:invalid { box-shadow:none; }
  }
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
  