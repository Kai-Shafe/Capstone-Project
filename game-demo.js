let util = require('./util.js');
let all_questions = require('./questions.json');

const readline = require('readline');
class FibbageGame {
    constructor(players) {
      this.players = players;
      this.scores = {}; // Object to store player scores
      this.fakeAnswers = Array(players.length).fill([]); // Array to store fake answers for each player
      this.questions;
      this.correct_answers;
      this.currentQuestionIndex = 0;
      this.answers = [];
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }

    promptUser(prompt) {
      return new Promise(resolve => this.rl.question(prompt, answer => {
        resolve(answer);
      }));
    }

    async getQuestions() {
      const prompt = "Please select an option: [1] Choose a set of questions   [2] Create a new set of questions\n";
      let option = await this.promptUser(prompt);
      if(option == "1") {
        await this.getQuestionsFromList();
      }
      else {
        await this.createQuestionSet();
        await this.getQuestions();
      }
    }

    async getQuestionsFromList() {
      console.log("Please select a set of questions to use:");
      for(let i = 0; i < all_questions.length; i++) // Print out all of the saved question sets
      {
        console.log(`[${i}] ${all_questions[i].subject}`);
      }
      const chosen_subject_index = await this.promptUser("");
      const chosen_subject = all_questions[chosen_subject_index].subject;
      this.correct_answers = util.get_correct_answers(all_questions, chosen_subject);
      this.questions = util.get_questions(all_questions, chosen_subject);
    }

    async createQuestionSet() {
      let new_questions = [];
      let new_answers = [];
      const new_subject = await this.promptUser("Subject name: ");
      const num_questions = await this.promptUser("Number of questions: ");
      for(let i = 0; i < num_questions; i++)
      {
        const new_question = await this.promptUser("Enter question: ");
        new_questions.push(new_question);
        const new_answer = await this.promptUser("Enter answer: ");
        new_answers.push(new_answer);
      }
      util.write_to_JSON(all_questions, new_subject, new_questions, new_answers);
    }


  
  async startRound() {
    this.fakeAnswers = Array(this.players.length).fill([]); // Clear fake answers array between rounds
    await this.displayQuestionFake();
    await this.shuffleAnswers();
    await this.displayQuestion();
  }

  async getFakeAnswers() {
    const fakeAnswers = [];
    for (let player of this.players) {
      const playerFakeAnswer = await this.askPlayerFake(player);
      fakeAnswers.push(playerFakeAnswer);
    }
    //console.log(fakeAnswers)
    return fakeAnswers;
  }

  async shuffleAnswers() {
    const correctAnswer = this.correct_answers[this.currentQuestionIndex];
    const fakeAnswers = await this.getFakeAnswers();
    this.answers = shuffle([correctAnswer, ...fakeAnswers]);

     //Store fake answers in the array with player indices
    this.fakeAnswers = fakeAnswers
    //console.log(this.fakeAnswers)
  }
    
    async displayQuestion() {
      const question = this.questions[this.currentQuestionIndex];
      const shuffledAnswers = this.answers;
  
      console.log(`Question: ${question}`);
      console.log("Shuffled Answers:", shuffledAnswers);
  
      await this.collectPlayerAnswers();
    }
    
  async displayQuestionFake() {
    const question = this.questions[this.currentQuestionIndex];
    console.log(`Question: ${question}`);
    // Collect fake answers only once
    //await this.getFakeAnswers();
  }
    
    //async displayAnswers
  
    /*getCorrectAnswer() {
      return `Correct Answer for "${this.questions[this.currentQuestionIndex]}"`;
    }*/
  
    async collectPlayerAnswers() {
      const correctAnswer = this.correct_answers[this.currentQuestionIndex];
    
      for (let player of this.players) {
        let playerAnswer = await this.askPlayer(player);
        
        // Check if the answer is correct
        if (playerAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
          // Award points for guessing correct answers
          this.scores[player] = this.scores[player] || 0;
          this.scores[player] += 50; // Adjust points as needed
          console.log(`Player ${player} guessed the correct answer! (+50 points)`);
        } else {
          // Check if the answer is a fake answer
          let fakeAnswerPlayer = this.fakeAnswers.findIndex(answers => answers.includes(playerAnswer));
          if (fakeAnswerPlayer !== -1) {
            while (fakeAnswerPlayer + 1 === Number(player)) {
                console.log("You cannot choose your own answer.")
                playerAnswer = await this.askPlayer(player)
                fakeAnswerPlayer = this.fakeAnswers.findIndex(answers => answers.includes(playerAnswer));
            }
            // Award points for guessing a fake answer
            this.scores[fakeAnswerPlayer + 1] = this.scores[fakeAnswerPlayer + 1] || 0;
            this.scores[fakeAnswerPlayer + 1] += 100; // Award 100 points for guessing a fake answer
            console.log(`Player ${player} guessed Player ${fakeAnswerPlayer + 1}'s fake answer! (+100 points)`);
          }
        }
      }
    
      // Move to the next question or end the game
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < this.questions.length) {
        await this.startRound();
      } else {
        this.displayFinalScores();
        console.log("Game Over. Thanks for playing!");
        this.rl.close();
      }
    }

  displayFinalScores() {
    console.log("Final Scores:");
    for (let player of this.players) {
      console.log(`Player ${player}: ${this.scores[player]} points`);
    }
  }

  askPlayerFake(player){
    return new Promise(resolve => {
        const theFakes=this.fakeAnswers;
        const question=`Enter your Fake Answer, Player ${player}: `;
        const correctAnswer = this.correct_answers[this.currentQuestionIndex];
        this.rl.question(question,answer=>{
          if(theFakes.includes(answer) || answer==correctAnswer){
              console.log(`Try a different fake answer...`);//output when answer is either the same as another fake answer or it is the correct answer
              this.askPlayerFake(player).then(resolve);
          }else{
              this.fakeAnswers.push(answer);
              resolve(answer);
          }
        })

    });
  }
    async askPlayer(player) {
        const shuffledAnswers = this.answers;

        return new Promise(resolve => {
            const question = `Enter your answer, Player ${player} (${shuffledAnswers.join(', ')}): `;

            this.rl.question(question, answer => {
            // Check if the entered answer is one of the shuffled answers
                if (shuffledAnswers.includes(answer)) {
                resolve(answer);
                } else {
                    console.log(`Invalid answer. Please enter one of the displayed options.`);
                    // Ask the player again for a valid answer
                    this.askPlayer(player).then(resolve);
                }
            });
        });
    }
  }
  
  // Helper function to shuffle an array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array; 
  }
  
  // Example usage
  const players = ["1", "2", "3"];
  const fibbageGame = new FibbageGame(players);
  async function begin() {
    await fibbageGame.getQuestions();
    fibbageGame.startRound();
  }
  begin();
