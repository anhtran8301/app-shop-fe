// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Axios Imports
import {  createRoleAsync, deleteRoleAsync, getAllRolesAsync, updateRoleAsync } from './actions'


const initialState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  typeError: '',
  isSuccessCreateEdit: false,
  isErrorCreateEdit: false,
  messageErrorCreateEdit: '',
  isSuccessDelete: false,
  isErrorDelete: false,
  messageErrorDelete: '',

  roles: {
    data: [],
    total: 0
  }
}

export const roleSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetInitialState: state => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.typeError = ''

      state.isSuccessCreateEdit = false
      state.isErrorCreateEdit = true
      state.messageErrorCreateEdit = ''

      state.isSuccessDelete = false
      state.isErrorDelete = true
      state.messageErrorDelete = ''
    }
  },
  extraReducers: builder => {
    // ** Get all roles
    builder.addCase(getAllRolesAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.roles.data = action.payload?.data?.roles
      state.roles.total = action.payload?.data?.totalCount

    })
    builder.addCase(getAllRolesAsync.rejected, (state, action) => {
      state.isLoading = false
      state.roles.data = []
      state.roles.total = 0
    })

    // ** Create role
    builder.addCase(createRoleAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createRoleAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError

    })

    // ** Update role
    builder.addCase(updateRoleAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateRoleAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessCreateEdit = !!action.payload?.data?._id
      state.isErrorCreateEdit = !action.payload?.data?._id
      state.messageErrorCreateEdit = action.payload?.message
      state.typeError = action.payload?.typeError

    })

    // ** Delete role
    builder.addCase(deleteRoleAsync.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteRoleAsync.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccessDelete = !!action.payload?.data?._id
      state.isErrorDelete = !action.payload?.data?._id
      state.messageErrorDelete = action.payload?.message
      state.typeError = action.payload?.typeError

    })
   
  }
})

export const { resetInitialState } = roleSlice.actions
export default roleSlice.reducer
