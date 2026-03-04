import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isLoggedIn:false,
        isError:null,
    },
    reducers:{
        addUser:(state,action)=>{
            state.user= action.payload;
            state.isLoggedIn = true;
            state.isError = null;
        },
        removeUser:(state,action)=>{
            state.user = action.payload;
            state.isLoggedIn = false,
            state.isError = null;
        },
        setError:(stat,action)=>{
            stat.isError = action.payload;
        }
    }
})

export const {addUser,removeUser,setError} = authSlice.actions;
export default authSlice.reducer;

