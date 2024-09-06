import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Services
import { createUser, deleteMultipleUser, deleteUser, editUser, getAllUsers } from 'src/services/user'

// ** Types
import { TParamsCreateUser, TParamsDeleteMultipleUser, TParamsEditUser, TParamsGetUsers } from 'src/types/user'

const serviceName = 'user'

// ** Add User
export const getAllUsersAsync = createAsyncThunk(`${serviceName}/get-all`, async (data: { params: TParamsGetUsers }) => {
  const response = await getAllUsers(data)

  return response
})

// ** Create
export const createUserAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateUser) => {
  const response = await createUser(data)

  return response
})

// ** Update
export const updateUserAsync = createAsyncThunk(`${serviceName}/update`, async (data: TParamsEditUser) => {
  const response = await editUser(data)

  return response
})

// ** Delete
export const deleteUserAsync = createAsyncThunk(`${serviceName}/delete`, async (id: string) => {
  const response = await deleteUser(id)

  return response
})

// ** Delete many
export const deleteMultipleUserAsync = createAsyncThunk(`${serviceName}/delete-multiple`, async (data: TParamsDeleteMultipleUser) => {
  const response = await deleteMultipleUser(data)

  return response
})
