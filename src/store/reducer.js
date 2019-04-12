
const initState = {
    executeTestRun: false
}

export function reducer(state = initState, action) {
    if(action.type === 'EXECUTE') {
        return {
            ...state,
            executeTestRun: !state.executeTestRun
        }
    }
    return state
}