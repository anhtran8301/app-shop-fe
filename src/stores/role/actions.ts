import { createAsyncThunk } from '@reduxjs/toolkit'

// ** Services
import { createRole, deleteRole, editRole, getAllRoles } from 'src/services/role'

// ** Types
import { TParamsCreateRole, TParamsEditRole, TParamsGetRoles } from 'src/types/role'

const serviceName = 'role'

// ** Add Role
export const getAllRolesAsync = createAsyncThunk(`${serviceName}/get-all`, async (data: { params: TParamsGetRoles }) => {
  const response = await getAllRoles(data)

  return response
})

// ** Create
export const createRoleAsync = createAsyncThunk(`${serviceName}/create`, async (data: TParamsCreateRole) => {
  const response = await createRole(data)

  return response
})

// ** Update
export const updateRoleAsync = createAsyncThunk(`${serviceName}/update`, async (data: TParamsEditRole) => {
  const response = await editRole(data)

  return response
})

// ** Delete
export const deleteRoleAsync = createAsyncThunk(`${serviceName}/delete`, async (id: string) => {
  const response = await deleteRole(id)

  return response
})
