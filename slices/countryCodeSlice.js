import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    country: 'Nigeria',
    countryCode: 'NG',
    callingCode: '+234',
    phone: '0'
}

export const countryCodeSlice = createSlice({
  name: 'countryCode',
  initialState,
  reducers: {
    setCountryAndCallCode: (state, action) => {
      state.country = action.payload?.country
      state.countryCode = action.payload?.countryCode
      state.callingCode = action.payload?.callingCode
      state.phone = action.payload?.phone
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCountryAndCallCode } = countryCodeSlice.actions

export default countryCodeSlice.reducer