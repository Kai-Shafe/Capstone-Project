import { defineStore } from "pinia"
import Ably from "ably"

export const useNetworkStore = defineStore('network', {
    state: () => ({
        ably: null,
        currentState: 'none',
        roomCode: '',
        username: '',
        host: false,
        answers: [],
        selectedAnswers: [],
        clockTimer: 0,
        stopTimer: false,
        players: []
    }),
    getters: {
        getCurrentState: (state) => state.currentState,
    },
    actions: { 
        async hostGame() {
            this.host = true
            this.ably = new Ably.Realtime("U0BmEg.TBPDSg:5fPvDChSUKQsAv1K4_wQYJ5NGoze9kd8l11r8jBgdbU")
            this.ably.connection.once("connected", () => {
                console.log("Conntected to ably server!")
            })

            this.roomCode = (Math.random() + 1).toString(36).substring(7).toUpperCase();
        
            const channel = this.ably.channels.get(this.roomCode)
            await channel.subscribe((message) => {
                switch (message.name) {
                    case "connected":
                        this.players.push(message.data.username)
                        break
                    case "start_round":
                        this.currentState = 'answer-question'
                        this.startTimer()
                        break
                    case "answer_sent":
                        this.answers.push({username: message.data.username, answer: message.data.answer})
                        if (this.answers.length == this.players.length) {
                            this.stopTimer = true
                        }
                        break
                    case "show_answers":
                        this.currentState = 'show-answers'
                        this.startTimer()
                        break
                    case "answer_selected":
                        this.selectedAnswers.push({username: message.data.username, answer_selected: message.data.answer_selected})
                        if (this.selectedAnswers.length == this.players.length) {
                            this.stopTimer = true
                        }
                        break
                    default: {
                        console.log(message.name)
                    }
                }
            })
        
            await channel.publish("connected", { username: this.username })
            this.currentState = 'waiting'
        },
        async joinGame(roomCodeInput) {
            this.ably = new Ably.Realtime("U0BmEg.TBPDSg:5fPvDChSUKQsAv1K4_wQYJ5NGoze9kd8l11r8jBgdbU")
            this.ably.connection.once("connected", () => {
                console.log("Conntected to ably server!")
            })

            const channel = this.ably.channels.get(roomCodeInput)
            await channel.subscribe((message) => {
                switch (message.name) {
                    case "start_round":
                        this.currentState = 'answer-question'
                        this.startTimer()
                        break
                    case "show_answers":
                        this.stopTimer = true
                        this.startTimer()
                        this.currentState = 'show-answers'
                        this.answers = message.data.answers
                        break
                    case "show_correct_answer":
                        this.stopTimer = true
                        this.currentState = 'show-correct-answer'
                        this.selectedAnswers = message.data.selectedAnswers
                        break
                    default: {
                        console.log(message.data.username)

                    }
                }
            })

            this.roomCode = roomCodeInput

            await channel.publish("connected", { username: this.username })
            this.currentState = 'waiting'
        },
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
        async startGame() {
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("start_round", { username: this.username })
        },
        async sendAnswer(answer) {
            this.currentState = 'answer-sent'
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("answer_sent", { username: this.username, answer: answer })
        },
        async showAnswers() {
            const channel = this.ably.channels.get(this.roomCode)
            // Change how correct answer is picked
            this.answers.push({username: "Correct", answer: "Brasília"})
            await channel.publish("show_answers", { answers: this.answers })
        },
        async selectAnswer(answer) {
            this.currentState = 'answer-selected'
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("answer_selected", { username: this.username, answer_selected: answer })
        },
        async showCorrectAnswer() {
            this.currentState = 'show-correct-answer'
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("show_correct_answer", { selected_answers: this.selectedAnswers })
        }
    }
})