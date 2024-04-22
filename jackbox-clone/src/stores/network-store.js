import { defineStore } from "pinia"
import Ably from "ably"
import json_object from "../../questions.json"

const CORRECT_SELECTED = 10
const FAKE_SELECTED = 5

export const useNetworkStore = defineStore('network', {
    state: () => ({
        ably: null,
        currentState: 'none',
        roomCode: '',
        username: '',
        host: false,
        players: new Set(),
        answers: new Map(),
        points: new Map(),
        selectedAnswers: new Map(),
        clockTimer: 0,
        stopTimer: false,
        currentQuestion: '',
        currentCorrectAnswer: '',
        currentRound: -1,
        maxRounds: 5,
        questions: json_object.questions,
        tryAnotherAnswer: false
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
                        // Guarantee unique usernames.
                        const newUsername=this.getUniqueUsername(message.data.username)
                        this.players.add(newUsername);
                        this.points.set(newUsername,0);

                        this.subscribeWithModifiedMessage(newUsername);
                        
                        break

                    // Begin game round.
                    case "start_round":
                        this.currentRound = this.currentRound + 1
                        this.answers.clear()
                        this.selectedAnswers.clear()
                        this.currentQuestion = this.questions[this.currentRound].text
                        this.currentCorrectAnswer = this.questions[this.currentRound].correct_answer
                        this.answers.set("Correct", this.currentCorrectAnswer)
                        this.currentState = 'answer-question'
                        this.startTimer()
                        break

                    // Client submission of fake answer.
                    case "answer_sent":
                        this.answers.set(message.data.username, message.data.answer)
                        if (this.answers.size - 1 == this.players.size) {
                            this.stopTimer = true
                        }
                        break

                    // Display all answers to clients. Updates this.answers with shuffled array
                    case "show_answers":
                        this.answers.clear()
                        for(let i = 0; i < message.data.answers_array.length; i++)
                        {
                            this.answers.set(message.data.answers_array[i].username, message.data.answers_array[i].answer)
                        }

                        this.currentState = 'show-answers'
                        this.startTimer()
                        break

                    // Collect answer selections from clients.
                    case "answer_selected":
                        // Add player and associated selected answer to map.
                        this.selectedAnswers.set(message.data.username, message.data.answer_selected)
                        // Once all players have submitted:
                        if (this.selectedAnswers.size == this.players.size) {
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

                    // Begin game round.
                    case "start_round":
                        this.players.clear()
                        for(let i = 0; i < message.data.usernames.length; i++)
                        {
                            this.players.add(message.data.usernames[i])
                        }

                        this.currentRound = this.currentRound + 1
                        this.answers.clear()
                        this.currentQuestion = this.questions[this.currentRound].text
                        this.currentCorrectAnswer = this.questions[this.currentRound].correct_answer
                        this.answers.set("Correct", this.currentCorrectAnswer)
                        this.currentState = 'answer-question'
                        this.startTimer()
                        break

                    // Client submission of fake answer.
                    case "answer_sent":
                        this.answers.set(message.data.username, message.data.answer)
                        break

                    // Display all answers.
                    case "show_answers":
                        // Places shuffled usernames & answers into Map
                        this.answers.clear()
                        for(let i = 0; i < message.data.answers_array.length; i++)
                        {
                            this.answers.set(message.data.answers_array[i].username, message.data.answers_array[i].answer)
                        }
                        
                        this.stopTimer = true
                        this.startTimer()
                        this.currentState = 'show-answers'
                        break

                    // Display correct answer.
                    case "show_correct_answer":
                        this.stopTimer = true
                        
                        // Places usernames and points into Map
                        this.points.clear()
                        for(let i = 0; i < message.data.playerPoints.length; i++)
                        {
                            this.points.set(message.data.playerPoints[i].username, message.data.playerPoints[i].points)
                        }

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
        getUniqueUsername(username) {
            let newUsername = username;
            if (this.players.has(newUsername)) {
                newUsername = this.getUniqueUsername(username + "1");
            }
            return newUsername;
        },
    
        subscribeWithModifiedMessage(username) {
            const modifiedMessage = { name: "modified", data: { username: username } };
            this.channel.subscribe((message) => {
                switch (message.name) {
                    case "modified":
                        // Handle the modified message here
                        break;
                }
            });
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
        Start Round:
            -Publish start_round message to channel.
            -Only called by host
        */
        async startRound() {
            if(this.currentRound + 1 == this.questions.length)
            {
                // Reached end of question list
                return
            }

            const channel = this.ably.channels.get(this.roomCode)
            let players_array = Array.from(this.players)
            await channel.publish("start_round", { usernames: players_array })
        },

        /*
        Send Answer:
            -Change state (change UI view).
            -Publish answer_sent message with username and fake answer data.
        */
        async sendAnswer(answer) {
            if(this.tryAnotherAnswer)
            {
                this.tryAnotherAnswer = false
            }

            // Checks if fake answer has already been sent by another user, or if it is the correct answer
            for(const value of this.answers.values())
            {
                if(answer == value)
                {
                    // Answer is either the correct answer or has already been sent by another user
                    this.tryAnotherAnswer = true
                    return
                }
            }

            this.currentState = 'answer-sent'
            const channel = this.ably.channels.get(this.roomCode)
            await channel.publish("answer_sent", { username: this.username, answer: answer })
        },

        /*
        Show Answers:
            -Publish show_answers message to channel with answers map.
            -Shuffles answers
            -Only called by host
        */
        async showAnswers() {
            const channel = this.ably.channels.get(this.roomCode)

            // Stores key/value pairs into an array, because Ably will not send a Map. Also shuffles array
            let answers_array = Array.from(this.answers, ([username, answer]) => ({username, answer}))
            answers_array = shuffle(answers_array)
            
            await channel.publish("show_answers", { answers_array: answers_array})
        },

        /*
        Select Answer:
            -Change state (change UI view).
            -Publish answer_selected message to channel with username and selected answer data.
        */
        async selectAnswer(answer) {
            // Prevents users from selecting their own answer.
            if(answer == this.answers.get(this.username))
            {
                return
            }
            this.currentState = 'answer-selected';
            const channel = this.ably.channels.get(this.roomCode);

            // Publish the selected answer
            await channel.publish("answer_selected", { username: this.username, answer_selected: answer });
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
            const channel = this.ably.channels.get(this.roomCode)
            
            // Stores key/value pairs into an array, because Ably will not send a Map
            // Sorts points array
            let points_array = Array.from(this.points, ([username, points]) => ({ username, points }));
            points_array.sort((a, b) => b.points - a.points)
            this.points.clear()
            for(let i = 0; i < points_array.length; i++)
            {
                this.points.set(points_array[i].username, points_array[i].points)
            }
            this.currentState = 'show-correct-answer'
            await channel.publish("show_correct_answer", { playerPoints: points_array})
        }
    }
})

// Helper function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) 
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array; 
}