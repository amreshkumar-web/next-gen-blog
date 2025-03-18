import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    name:"",
    myId:"",
    access:"",
    profileimage:""
};


const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action) => {
            console.log("Reducer Action: ", action);
            state.name = action.payload.name;
            state.myId = action.payload.myId;
            state.access = action.payload.access;
            state.profileimage = action.payload.profileimage;
        },
        clearUser:(state) => {
            state.name = "";
            state.myId = "";
            state.access = "";
            state.profileimage = "";
        }
    }
});

export const{setUser,clearUser} = userSlice.actions;
export default userSlice.reducer;