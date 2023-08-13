import { defineStore } from 'pinia'

type State = {
    whiteboards: any
}
  
export const whiteboardsLocalStore = defineStore({
    id: 'whiteboardsLocal',
    state: (): State =>({
        whiteboards: {}
    })
})