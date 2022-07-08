import { createSlice } from '@reduxjs/toolkit'


export interface CounterState {
	user: any
	value: any
}

const initialState: CounterState = {
	user: null,
	value: 0
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logInGoogle: (state, action) => {
			state.user = action.payload
		},
		logOutGoogle: (state) => {
			state.user = null
		}
	}
})

export const {logInGoogle, logOutGoogle} = authSlice.actions

export default authSlice.reducer