import { createSlice } from '@reduxjs/toolkit'

const token = localStorage.getItem("accessToken")

const initialState = {
    value: token === null ? false : true,
}

export const authentication = createSlice({
    name: "auth",
    initialState,
    reducers:{
        loginSuccess: (state) => {
            state.value = true
        },
        loginFail: (state) => {
            state.value = false
        },
        logout: (state) => {
            state.value = false
        }
    }
})

export const {loginSuccess, loginFail, logout} = authentication.actions

export default authentication.reducer