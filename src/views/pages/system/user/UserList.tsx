// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// **React
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, useTheme, Grid, Typography } from '@mui/material'
import { GridColDef, GridRowClassNameParams, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/user'
import { deleteUserAsync, getAllUsersAsync } from 'src/stores/user/actions'

// ** Config
import { OBJECT_TYPE_ERROR } from 'src/configs/role'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Services
import { getDetailsUser } from 'src/services/user'

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

type TProps = {}

const UserListPage: NextPage<TProps> = () => {
  // ** State
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [sortBy, setSortBy] = useState('createdAt asc')
  const [searchBy, setSearchBy] = useState('')
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState({ id: '', name: '' })
  const [loading, setLoading] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [page, setPage] = useState(1)

  // ** Hooks
  const { VIEW, UPDATE, DELETE, CREATE } = usePermission('SYSTEM.USER', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  // ** Translate
  const { t, i18n } = useTranslation()

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
    typeError
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
    dispatch(getAllUsersAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  const handleGetDetailsUsers = async (id: string) => {
    setLoading(true)
    await getDetailsUser(id)
      .then(res => {
        if (res?.data) {
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

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    setSortBy(`${sortOption.field} ${sortOption.sort}`)
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

  const handleOnchangePagination = () => {}

  const columns: GridColDef[] = [
    {
      field: 'fullName',
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

        return <Typography>{row.role?._id}</Typography>
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

  useEffect(() => {
    handleGetListUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy])

  useEffect(() => {
    if (selectedRow.id) {
      handleGetDetailsUsers(selectedRow.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow])

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, mb: 4 }}>
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
          {/* <Box sx={{ maxHeight: '100%' }}> */}
          <CustomDataGrid
            rows={users.data}
            columns={columns}
            pageSizeOptions={[5]}
            autoHeight
            sx={{
              '.row-selected': {
                backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`,
                color: `${theme.palette.primary.main} !important`
              }
            }}
            sortingOrder={['desc', 'asc']}
            sortingMode='server'
            onSortModelChange={handleSort}
            getRowId={row => row._id}
            disableRowSelectionOnClick
            // getRowClassName={(row: GridRowClassNameParams) => {
            //   return row.id === selectedRow.id ? 'row-selected' : ''
            // }}
            slots={{ pagination: PaginationComponent }}
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
