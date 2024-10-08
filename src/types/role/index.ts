export type TParamsGetRoles = {
  limit?: number
  page?: number
  search?: string
  order?: string
}

export type TParamsCreateRole = {
  name: string
}

export type TParamsEditRole = {
  id: string
  name: string
  permissions?: string[]
}
