import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isLoggedIn:false,
        isError:null,
        authChecked:false,
        authLoading:false,
    },
    reducers:{
        startAuthCheck:(state)=>{
            state.authLoading = true;
        },
        addUser:(state,action)=>{
            state.user= action.payload;
            state.isLoggedIn = true;
            state.isError = null;
            state.authChecked = true;
            state.authLoading = false;
        },
        removeUser:(state,action)=>{
            state.user = action.payload;
            state.isLoggedIn = false,
            state.isError = null;
            state.authChecked = true;
            state.authLoading = false;
        },
        setError:(stat,action)=>{
            stat.isError = action.payload;
        },
        resetAuthCheck:(state)=>{
            state.authChecked = false;
            state.authLoading = false;
        }
    }
})

export const {addUser,removeUser,setError,startAuthCheck,resetAuthCheck} = authSlice.actions;
export default authSlice.reducer;

