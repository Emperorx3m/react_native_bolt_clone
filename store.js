import { configureStore } from '@reduxjs/toolkit'
import countryCodeReducer from 'slices/countryCodeSlice'
import navReducer from 'slices/navSlice'

export const store = configureStore({
  reducer: {
    countryCode: countryCodeReducer,
    nav: navReducer
  },
})