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
  