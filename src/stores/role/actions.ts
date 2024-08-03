import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Services
import { createRole, deleteRole, editRole, getAllRoles } from 'src/services/role'
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'

// ** Add User
export const getAllRolesAsync = createAsyncThunk('role/get-all', async (data: { params: TParamsGetRoles }) => {
  const response = await getAllRoles(data)

  return response
})

// ** Create
export const createRoleAsync = createAsyncThunk('role/create', async (data: TParamsCreateRole) => {
  const response = await createRole(data)

  return response
})

// ** Update
export const updateRoleAsync = createAsyncThunk('role/update', async (data: TParamsEditRole) => {
  const response = await editRole(data)

  return response
})

// ** Delete
export const deleteRoleAsync = createAsyncThunk('role/delete', async (id: string) => {
  const response = await deleteRole(id)

  return response
})
