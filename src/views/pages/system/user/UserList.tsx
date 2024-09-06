// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// **React
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, useTheme, Grid, Typography, styled, ChipProps, Chip } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/user'
import { deleteMultipleUserAsync, deleteUserAsync, getAllUsersAsync } from 'src/stores/user/actions'

// ** Config
import { OBJECT_TYPE_ERROR } from 'src/configs/role'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { OBJECT_STATUS_USER } from 'src/configs/user'
import { PERMISSIONS } from 'src/configs/permission'

// ** Services
import { getAllRoles } from 'src/services/role'

// ** Utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { toFullName } from 'src/utils'

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Components
import CustomDataGrid from 'src/components/custom-data-grid'
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import CustomPagination from 'src/components/custom-pagination'
import CreateEditUser from './components/CreateEditUser'
import TableHeader from 'src/components/table-header'
import CustomSelect from 'src/components/custom-select'

type TProps = {}

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

const ActiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#28c76f29',
  color: '#3a843f',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const DeactivateUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#da251d29',
  color: '#da251d',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const UserListPage: NextPage<TProps> = () => {
  // ** Translate
  const { t, i18n } = useTranslation()

  // ** State
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleUser, setOpenDeleteMultipleUser] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState('createdAt desc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [page, setPage] = useState(1)
  const [selectedRowTable, setSelectedRowTable] = useState<TSelectedRow[]>([])
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [roleSelected, setRoleSelected] = useState('')
  const [statusSelected, setStatusSelected] = useState('')
  const [filterBy, setFilterBy] = useState<Record<string, string>>({})

  const CONSTANT_STATUS_USER = OBJECT_STATUS_USER()

  // ** Hooks
  const { VIEW, UPDATE, DELETE, CREATE } = usePermission('SYSTEM.USER', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  // ** Router
  const router = useRouter()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const {
    users,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete
  } = useSelector((state: RootState) => state.user)

  //** theme
  const theme = useTheme()

  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnchangePagination}
        pageSizeOptions={PAGE_SIZE_OPTION}
        pageSize={pageSize}
        page={page}
        rowLength={users.total}
      />
    )
  }

  // ** fetch
  const handleGetListUsers = () => {
    const query = { params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...filterBy } }
    dispatch(getAllUsersAsync(query))
  }

  const fetchAllRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.roles
        if (data) {
          setOptionRoles(
            data?.map((item: { name: string; _id: string }) => ({
              label: item.name,
              value: item._id
            }))
          )
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  // ** Handles
  const handleCloseConfirmDeleteUser = () => {
    setOpenDeleteUser({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleUser = () => {
    setOpenDeleteMultipleUser(false)
  }

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('createdAt desc')
    }
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleDeleteUser = () => {
    dispatch(deleteUserAsync(openDeleteUser.id))
  }

  const handleDeleteMultipleUser = () => {
    dispatch(
      deleteMultipleUserAsync({
        userIds: selectedRowTable?.map((item: TSelectedRow) => item.id)
      })
    )
  }

  const handleAction = (type: string) => {
    switch (type) {
      case 'delete':
        {
          setOpenDeleteMultipleUser(true)
          break
        }

        break
    }
  }

  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const columns: GridColDef[] = [
    {
      field: i18n.language === 'vi' ? 'lastName' : 'firstName',
      headerName: t('Full_name'),
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params
        const fullName = toFullName(row?.lastName || '', row?.middleName || '', row?.firstName || '', i18n.language)

        return <Typography>{fullName}</Typography>
      }
    },
    {
      field: 'email',
      headerName: t('Email'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.email}</Typography>
      }
    },
    {
      field: 'role',
      headerName: t('Role'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber',
      headerName: t('Phone_number'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.phoneNumber}</Typography>
      }
    },
    {
      field: 'city',
      headerName: t('City'),
      minWidth: 200,
      maxWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row.city}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('Status'),
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return (
          <>{row.status ? <ActiveUserStyled label={t('Active')} /> : <DeactivateUserStyled label={t('Block')} />}</>
        )
      }
    },
    {
      field: 'actions',
      headerName: t('Actions'),
      minWidth: 150,
      sortable: false,
      align: 'left',
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ width: '100%' }}>
            <>
              <GridEdit
                disabled={!UPDATE}
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: String(params.id)
                  })
                }
              />
              <GridDelete
                disabled={!DELETE}
                onClick={() =>
                  setOpenDeleteUser({
                    open: true,
                    id: String(params.id)
                  })
                }
              />
            </>
          </Box>
        )
      }
    }
  ]

  // ** Memo
  const memoDisabledDeleteUser = useMemo(() => {
    return selectedRowTable.some((item: TSelectedRow) => item?.role?.permissions?.includes(PERMISSIONS.ADMIN))
  }, [selectedRowTable])

  useEffect(() => {
    handleGetListUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])

  useEffect(() => {
    setFilterBy({ roleId: roleSelected, status: statusSelected })
  }, [roleSelected, statusSelected])

  useEffect(() => {
    fetchAllRoles()
  }, [])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_user_success'))
      } else {
        toast.success(t('Update_user_success'))
      }
      handleGetListUsers()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_user_error'))
        } else {
          toast.error(t('Create_user_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_user_success'))
      handleGetListUsers()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteUser()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_user_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  // ** Delete multiple users
  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('Delete_multiple_user_success'))
      handleGetListUsers()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleUser()
      setSelectedRowTable([])
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('Delete_multiple_user_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteUser.open}
        handleClose={handleCloseConfirmDeleteUser}
        handleCancel={handleCloseConfirmDeleteUser}
        handleConfirm={handleDeleteUser}
        title={t('Title_delete_user')}
        description={t('Confirm_delete_user')}
      />

      <ConfirmationDialog
        open={openDeleteMultipleUser}
        handleClose={handleCloseConfirmDeleteMultipleUser}
        handleCancel={handleCloseConfirmDeleteMultipleUser}
        handleConfirm={handleDeleteMultipleUser}
        title={t('Title_delete_multiple_user')}
        description={t('Confirm_delete_multiple_user')}
      />
      <CreateEditUser open={openCreateEdit.open} onClose={handleCloseCreateEdit} id={openCreateEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%',
          width: '100%'
        }}
      >
        <Grid sx={{ height: '100%', width: '100%' }}>
          {!selectedRowTable?.length && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, mb: 4 }}>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => {
                    setStatusSelected(String(e.target.value))
                  }}
                  options={Object.values(CONSTANT_STATUS_USER)}
                  value={statusSelected}
                  placeholder={t('Status')}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => {
                    setRoleSelected(String(e.target.value))
                  }}
                  options={optionRoles}
                  value={roleSelected}
                  placeholder={t('Role')}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
              </Box>
              <GridCreate
                disabled={!CREATE}
                onClick={() => {
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }}
              />
            </Box>
          )}
          {selectedRowTable?.length > 0 && (
            <TableHeader
              numRow={selectedRowTable?.length}
              onClear={() => setSelectedRowTable([])}
              actions={[{ label: t('Delete'), value: 'delete', disabled: memoDisabledDeleteUser }]}
              handleAction={handleAction}
            />
          )}
          <CustomDataGrid
            rows={users.data}
            columns={columns}
            autoHeight
            sx={{
              '.row-selected': {
                backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`,
                color: `${theme.palette.primary.main} !important`
              }
            }}
            checkboxSelection
            sortingOrder={['desc', 'asc']}
            sortingMode='server'
            onSortModelChange={handleSort}
            getRowId={row => row._id}
            disableRowSelectionOnClick
            slots={{ pagination: PaginationComponent }}
            rowSelectionModel={selectedRowTable?.map(item => item.id)}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              const formatData: any[] = row.map(id => {
                const findRow: any = users?.data?.find((item: any) => item._id === id)
                if (findRow) {
                  return { id: findRow._id, role: findRow.role }
                }
              })
              setSelectedRowTable(formatData)
            }}
            disableColumnFilter
            disableColumnMenu
          />
          {/* </Box> */}
        </Grid>
      </Box>
    </>
  )
}

export default UserListPage
