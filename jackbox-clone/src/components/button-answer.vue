  
 <template>
    <button class="button-answer" >{{ answer }}</button>
  </template>
  
  <script>
  export default {
    name: 'ButtonAnswer',
    props: {
      answer: String
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
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
  .correct-answer {
    background-color: green;
    color: #ffffff;
    cursor: not-allowed
  }
  .incorrect-answer {
    background-color: red;
    color: #ffffff;
    cursor: not-allowed;
  }
  .disabled-answer{
    background-color: #e0e0e0 !important;
    color: #ffffff;
    cursor: not-allowed;

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
  </style>
  