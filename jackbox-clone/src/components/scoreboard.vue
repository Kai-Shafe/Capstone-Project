  
 <template>
    <div class="table-center">
        <table>
            <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Selected</th>
                <th>Lie</th>
            </tr>
            <tr v-for="[player, points] in pointsMap">
                <td>{{ player }}</td>
                <td>{{ points }}</td>
                <td>{{ selectedAnswers.get(player) }}</td>
                <td>{{ playerAnswers.get(player) }}</td>
            </tr>
        </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Scoreboard',
    props: {
        pointsMap: Map,
        selectedAnswers: Map,
        playerAnswers: Map
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .table-center {
    margin: 5%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td, th {
    color: #2c3e50;
    border: 1px solid #000000;
    padding: 8px;
  }

  td {
    background-color: rgb(230, 230, 230);
  }

  th {
    background-color: white;
  }
  </style>
  