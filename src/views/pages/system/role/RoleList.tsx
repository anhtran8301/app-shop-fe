// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// **React
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, useTheme, Grid, Button } from '@mui/material'
import { GridColDef, GridRowClassNameParams, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/role'
import { deleteRoleAsync, getAllRolesAsync, updateRoleAsync } from 'src/stores/role/actions'

// ** Config
import { OBJECT_TYPE_ERROR } from 'src/configs/role'
import { PERMISSIONS } from 'src/configs/permission'

// ** Services
import { getDetailsRole } from 'src/services/role'

// ** Utils
import { getAllValueOfObject } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Components
import CustomDataGrid from 'src/components/custom-data-grid'
import GridEdit from 'src/components/grid-edit'
import GridDelete from 'src/components/grid-delete'
import GridCreate from 'src/components/grid-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './components/CreateEditRole'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import IconifyIcon from 'src/components/Icon'
import TablePermission from './components/TablePermission'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // ** State
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteRole, setOpenDeleteRole] = useState({
    open: false,
    id: ''
  })
  const [sortBy, setSortBy] = useState('created asc')
  const [searchBy, setSearchBy] = useState('')
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState({ id: '', name: '' })
  const [loading, setLoading] = useState<boolean>(false)
  const [isDisablePermission, setIsDisablePermission] = useState<boolean>(false)

  // ** permissions
  const { VIEW, UPDATE, DELETE, CREATE } = usePermission('SYSTEM.ROLE', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  // ** Translate
  const { t } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const {
    roles,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.role)

  //** theme
  const theme = useTheme()

  // ** fetch
  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  const handleGetDetailsRoles = async (idRole: string) => {
    setLoading(true)
    await getDetailsRole(idRole)
      .then(res => {
        if (res?.data) {
          if (res?.data?.permissions.includes(PERMISSIONS.ADMIN)) {
            setIsDisablePermission(true)
            setPermissionSelected(getAllValueOfObject(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC]))
          } else if (res?.data?.permissions.includes(PERMISSIONS.BASIC)) {
            setIsDisablePermission(true)
            setPermissionSelected(PERMISSIONS.DASHBOARD)
          } else {
            setIsDisablePermission(false)
            setPermissionSelected(res?.data?.permissions || [])
          }
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const handleUpdateRoles = () => {
    dispatch(updateRoleAsync({ id: selectedRow.id, name: selectedRow.name, permissions: permissionSelected }))
  }

  // ** Handles
  const handleCloseConfirmDeleteRole = () => {
    setOpenDeleteRole({
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

  const handleDeleteRole = () => {
    dispatch(deleteRoleAsync(openDeleteRole.id))
  }

  // const PaginationComponent = () => {
  //   return (
  //     <CustomPagination
  //       onChangePagination={handleOnchangePagination}
  //       pageSizeOptions={PAGE_SIZE_OPTION}
  //       pageSize={pageSize}
  //       page={page}
  //       rowLength={roles.total}
  //     />
  //   )
  // }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1
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
            {!row?.permissions?.some((per: string) => ['ADMIN.GRANTED', 'BASIC.PUBLIC']?.includes(per)) ? (
              <>
                <GridEdit
                  onClick={() =>
                    setOpenCreateEdit({
                      open: true,
                      id: String(params.id)
                    })
                  }
                />
                <GridDelete
                  onClick={() =>
                    setOpenDeleteRole({
                      open: true,
                      id: String(params.id)
                    })
                  }
                />
              </>
            ) : (
              <IconifyIcon icon='material-symbols-light:lock-outline' fontSize={30} />
            )}
          </Box>
        )
      }
    }
  ]

  useEffect(() => {
    handleGetListRoles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy])

  useEffect(() => {
    if (selectedRow.id) {
      handleGetDetailsRoles(selectedRow.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_role_success'))
      } else {
        toast.success(t('Update_role_success'))
      }
      handleGetListRoles()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_role_error'))
        } else {
          toast.error(t('Create_role_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_role_success'))
      handleGetListRoles()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteRole()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_role_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteRole.open}
        handleClose={handleCloseConfirmDeleteRole}
        handleCancel={handleCloseConfirmDeleteRole}
        handleConfirm={handleDeleteRole}
        title={t('title_delete_role')}
        description={t('confirm_delete_role')}
      />
      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} idRole={openCreateEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%'
        }}
      >
        <Grid container sx={{ height: '100%', width: '100%' }}>
          <Grid item md={4} xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ width: '200px' }}>
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
              </Box>
              <GridCreate
                onClick={() => {
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }}
              />
            </Box>
            <Box sx={{ maxHeight: '100%' }}>
              <CustomDataGrid
                rows={roles.data}
                columns={columns}
                pageSizeOptions={[5]}
                autoHeight
                sx={{
                  '.row-selected': {
                    backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`,
                    color: `${theme.palette.primary.main} !important`
                  }
                }}
                hideFooter
                sortingOrder={['desc', 'asc']}
                sortingMode='server'
                onSortModelChange={handleSort}
                getRowId={row => row._id}
                disableRowSelectionOnClick
                getRowClassName={(row: GridRowClassNameParams) => {
                  return row.id === selectedRow.id ? 'row-selected' : ''
                }}
                onRowClick={row => {
                  setSelectedRow({ id: String(row.id), name: row?.row?.name })
                  setOpenCreateEdit({
                    open: false,
                    id: String(row.id)
                  })
                }}
                disableColumnFilter
                disableColumnMenu
              />
            </Box>
          </Grid>

          <Grid
            item
            md={8}
            xs={12}
            sx={{ maxHeight: '100%' }}
            paddingLeft={{ md: '40px', xs: '0' }}
            paddingTop={{ md: '0', xs: '20px' }}
          >
            {selectedRow?.id && (
              <>
                <Box sx={{ height: 'calc(100% - 40px)' }}>
                  <TablePermission
                    setPermissionSelected={setPermissionSelected}
                    permissionSelected={permissionSelected}
                    disabled={isDisablePermission}
                  />
                </Box>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button disabled={isDisablePermission} variant='contained' sx={{ mt: 3 }} onClick={handleUpdateRoles}>
                    {t('Edit')}
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
