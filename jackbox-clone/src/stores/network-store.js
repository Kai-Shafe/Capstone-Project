import { defineStore } from "pinia"
import Ably from "ably"

const CORRECT_SELECTED = 5
const FAKE_SELECTED = 5

export const useNetworkStore = defineStore('network', {
    state: () => ({
        ably: null,
        currentState: 'none',
        roomCode: '',
        username: '',
        host: false,
        players: [],
        answers: new Map(),
        points: new Map(),
        selectedAnswers: new Map(),
        clockTimer: 0,
        stopTimer: false,
        currentRound: 0,
        maxRounds: 5,
        questions: [], // TODO: Extract from json and fill with maxRounds num of questions.
    }),

    getters: {
        getCurrentState: (state) => state.currentState,
    },
    actions: { 
        /*
        Host Game:
            -Initialize an Ably server.
            -Host acts as the game server, taking actions as messages are recieved, and changing state accordingly.
        */
        async hostGame() {
            // Initialize Ably server from host.
            this.host = true
            this.ably = new Ably.Realtime("U0BmEg.TBPDSg:5fPvDChSUKQsAv1K4_wQYJ5NGoze9kd8l11r8jBgdbU")
            this.ably.connection.once("connected", () => {
                console.log("Conntected to ably server!")
            })

            // TODO (want): Guarantee unique room code.
            this.roomCode = (Math.random() + 1).toString(36).substring(7).toUpperCase();
            const channel = this.ably.channels.get(this.roomCode)
        
            // Ably message actions (host)
            await channel.subscribe((message) => {
                switch (message.name) {
                    // When a player connects.
                    case "connected":
                        // TODO (need): Guarantee unique usernames.
                        this.players.push(message.data.username)
                        this.points.set(message.data.username, 0)
                        break

                    // Initialize game session.
                    case "start_game":
                        this.currentRound = 0
                        // Prompt host for max rounds?
                        // TODO: Extract questions.
                        // Send questions to clients. (Do this sequentially round by round?)
                        channel.publish("questions_init", { allQuestions: this.questions })
                        break

                    // Begin game round.
                    case "start_round":
                        this.answers.clear()
                        this.selectedAnswers.clear()
                        // TODO: Extract current correct answer from questions array and underlying json object
                        this.answers.set("Correct", this.questions[this.currentRound])
                        this.currentState = 'answer-question'
                        this.startTimer()
                        break

                    // Client submission of fake answer.
                    case "answer_sent":
                        this.answers.set(message.data.username, message.data.answer)
                        if (this.answers.length == this.players.length) {
                            this.stopTimer = true
                        }
                        break

                    // Display all answers to clients.
                    case "show_answers":
                        this.currentState = 'show-answers'
                        this.startTimer()
                        break

                    // Collect answer selections from clients.
                    case "answer_selected":
                        // Add player and associated selected answer to map.
                        this.selectedAnswers.set(message.data.username, message.data.answer_selected)
                        // Once all players have submitted:
                        if (this.selectedAnswers.length == this.players.length) {
                            this.stopTimer = true
                        }
                        break

                    // Catch unhandled messages.    
                    default: {
                        console.log(message.name)
                    }
                }
            })
        
            await channel.publish("connected", { username: this.username })
            this.currentState = 'waiting'
        },

        // *** Game client functions: ***

        // Connect to Ably server.
        async joinGame(roomCodeInput) {
            // Initialize Ably connection.
            this.ably = new Ably.Realtime("U0BmEg.TBPDSg:5fPvDChSUKQsAv1K4_wQYJ5NGoze9kd8l11r8jBgdbU")
            this.ably.connection.once("connected", () => {
                console.log("Conntected to ably server!")
            })
            const channel = this.ably.channels.get(roomCodeInput)
            this.roomCode = roomCodeInput

            // Ably message actions (client)
            await channel.subscribe((message) => {
                switch (message.name) {

                    // Initialize questions for game client.
                    case "questions_init":
                        this.questions = message.allQuestions
                        break

                    // Begin game round.
                    case "start_round":
                        this.answers.clear()
                        this.currentState = 'answer-question'
                        this.startTimer()
                        break

                    // Display all answers.
                    case "show_answers":
                        this.stopTimer = true
                        this.startTimer()
                        this.currentState = 'show-answers'
                        this.answers = message.data.answers
                        break

                    // Display correct answer.
                    case "show_correct_answer":
                        this.stopTimer = true
                        this.currentState = 'show-correct-answer'
                        break

                    // Catch unhandled messages.
                    default: {
                        console.log(message.data.username)

                    }
                }
            })

            await channel.publish("connected", { username: this.username })
            this.currentState = 'waiting'
        },

        // Setters
        setState(stateNameInput) {
            this.currentState = stateNameInput
        },

        setRoomCode(roomCodeInput) {
            this.roomCode = roomCodeInput
            this.currentState = 'waiting'
        },

        setUsername(usernameInput) {
            this.username = usernameInput
            this.currentState = 'hostOrJoin'
            
        },

        // Timer
        // TODO (want): rewrite to be a more general timer, handle state transitions elsewhere.
        startTimer() {
            var id = setInterval(() => {
                if (this.clockTimer >= 100 || this.stopTimer == true) {
                    clearInterval(id)
                    if (this.host == true) {
                        if (this.currentState == 'answer-question' || this.currentState == 'answer-sent') {
                            this.showAnswers()
                        } else if (this.currentState == 'show-answers' || this.currentState == 'answer-selected') {
                            this.showCorrectAnswer()
                        }
                    }
                    this.clockTimer = 0
                    this.stopTimer = false
                } else {
                    this.clockTimer++;
                }
            }, 750);
        },

        // *** Game action messages: ***

        /*
        Start Game:
            -Publish start_round message to channel.
        */
        async startGame() {
            const channel = this.ably.channels.get(this.roomCode)
            // TODO: Do we need to send the username?
            await channel.publish("start_round", { username: this.username })
        },

        /*
        Send Answer:
            -Change state (change UI view).
            -Publish answer_sent message with username and fake answer data.
        */
        async sendAnswer(answer) {
            this.currentState = 'answer-sent'
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("answer_sent", { username: this.username, answer: answer })
        },

        /*
        Show Answers:
            -Publish show_answers message to channel with answers map.
        */
        async showAnswers() {
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("show_answers", { answers: this.answers })
        },

        /*
        Select Answer:
            -Change state (change UI view).
            -Publish answer_selected message to channel with username and selected answer data.
        */
        async selectAnswer(answer) {
            this.currentState = 'answer-selected'
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("answer_selected", { username: this.username, answer_selected: answer })
        },
        
        /*
        Show Correct Answer:
            -Change state (change UI view).
            -Publish show_correct_answer message to channel with selected answers data.
        */
        async showCorrectAnswer() {
            // Perform point calculations so that updated points can be sent from host.
            var prevPoints
            // For each entry in selectedAnswers:
            for (const [username, selectedAnswer] of this.selectedAnswers.entries()){
                // For each entry in answers:
                for(const [submittedUsername, submittedAnswer] of this.answers.entries()){
                    // If the selected answer is correct:
                    if(selectedAnswer.toUpperCase() == submittedAnswer.toUpperCase() && submittedUsername == "Correct"){
                        // Add points for that player.
                        prevPoints = this.points.get(username)
                        this.points.set(username, prevPoints + CORRECT_SELECTED)
                        // No need to check any others.
                        break
                    }
                    // If the selected answer matches another player's answer:
                    else if(selectedAnswer === submittedAnswer){
                        // Add points for the other player.
                        prevPoints = this.points.get(submittedUsername)
                        this.points.set(submittedUsername, prevPoints + FAKE_SELECTED)
                        // No need to check any others.
                        break
                    }
                }
            }
            this.currentState = 'show-correct-answer'
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("show_correct_answer", { playerPoints: this.points})
        }
    }
})