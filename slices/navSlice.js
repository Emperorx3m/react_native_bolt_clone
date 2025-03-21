import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    origin: null,
    destination: null,
    intermediate: [],
    travelTimeInfo: [],
    currentLocation: null,
};

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setIntermediate: (state, action) => {
            state.intermediate = action.payload;
        },
        setTravelTimeInfo: (state, action) => {
            state.travelTimeInfo = action.payload;
        },
        setCurrentLocation: (state, action) => {
            state.currentLocation = action.payload;
        },
    },
});

export const { setOrigin, setDestination,setIntermediate, setTravelTimeInfo, setCurrentLocation } = navSlice.actions;

export default navSlice.reducer;
