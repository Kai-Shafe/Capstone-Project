import { defineStore } from "pinia"

export const useNetworkStore = defineStore('network', {
    state: () => ({
        currentState: 'none',
        roomCode: '',
        username: '',
        host: false,
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
        }
    }
})