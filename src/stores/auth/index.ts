// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import { changePasswordMeAsync, registerAuthAsync, updateAuthMeAsync } from './actions'

// ** Types
import { UserDataType } from 'src/contexts/types'

type TInitialData = {
  // ** Common
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
  message: string,
  typeError: string,
  // ** Update me
  isSuccessUpdateMe: boolean,
  isErrorUpdateMe: boolean,
  messageUpdateMe: string,
  // ** Change password
  isSuccessChangePassword: boolean,
  isErrorChangePassword: boolean,
  messageChangePassword: string,
  userData: UserDataType | null
}

const initialState:TInitialData = {
  // ** Common
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  // ** Update me
  isSuccessUpdateMe: true,
  isErrorUpdateMe: false,
  messageUpdateMe: '',
  // ** Change password
  isSuccessChangePassword: true,
  isErrorChangePassword: false,
  messageChangePassword: '',
  userData: null
}

export const authUsersSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''

      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = true
      state.messageUpdateMe = ''

      state.isSuccessChangePassword = true
      state.isErrorChangePassword = false
      state.messageChangePassword = ''
    }
  },
  extraReducers: builder => {
    // ** Register
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = !!action.payload?.data?.email
      state.isError = !action.payload?.data?.email
      state.message = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(registerAuthAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''
    })

    // ** Update me
    builder.addCase(updateAuthMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateAuthMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessUpdateMe = !!action.payload?.data?.email
      state.isErrorUpdateMe = !action.payload?.data?.email
      state.messageUpdateMe = action.payload?.message
      state.typeError = action.payload?.typeError
      state.userData = action.payload.data
    })
    builder.addCase(updateAuthMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.typeError = ''
      state.isSuccessUpdateMe = false
      state.isErrorUpdateMe = false
      state.messageUpdateMe = ''
      state.userData = null
    })

    // ** Change password me
    builder.addCase(changePasswordMeAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(changePasswordMeAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessChangePassword = !!action.payload?.data
      state.isErrorChangePassword = !action.payload?.data
      state.messageChangePassword = action.payload?.message
      state.typeError = action.payload?.typeError
    })
    builder.addCase(changePasswordMeAsync.rejected, (state, action) => {
      state.isLoading = false
      state.typeError = ''
      state.isSuccessChangePassword = false
      state.isErrorChangePassword = false
      state.messageChangePassword = ''
    })
  }
})

export const { resetInitialState } = authUsersSlice.actions
export default authUsersSlice.reducer
