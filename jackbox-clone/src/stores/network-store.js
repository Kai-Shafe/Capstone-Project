import { defineStore } from "pinia"

export const useNetworkStore = defineStore('network', {
    state: () => ({
        currentState: 'none',
        roomCode: '',
        username: '',
        host: false,
        answers: []
    }),
    getters: {
        getCurrentState: (state) => state.currentState,
    },
    actions: {
        setState(stateNameInput) {
            this.currentState = stateNameInput
        },
        setRoomCode(roomCodeInput) {
            this.roomCode = roomCodeInput
            this.currentState = 'joined'
        },
        setUsername(usernameInput) {
            this.username = usernameInput
            this.currentState = 'waiting'
        },
        startGame() {
            this.currentState = 'answer-question'
        },
        sendAnswer(answer) {
            this.currentState = 'answer-sent'
            this.answers.push(answer)
            console.log('call network function to send answer: ', answer)
        }
    }
})