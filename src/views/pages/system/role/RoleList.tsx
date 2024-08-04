// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// **React
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, useTheme, Grid, Card } from '@mui/material'
import { GridColDef, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/role'
import { deleteRoleAsync, getAllRolesAsync } from 'src/stores/role/actions'

// ** Config
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

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

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  //State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
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

  // Translate
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
    messageErrorDelete
  } = useSelector((state: RootState) => state.role)

  //** theme
  const theme = useTheme()

  // ** fetch
  const handleGetListRoles = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
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
          <Box sx={{width: '100%' }}>
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
  }, [sortBy, searchBy])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update-role-success'))
      } else {
        toast.success(t('create-role-success'))
      }
      handleGetListRoles()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit) {
      toast.error(t(messageErrorCreateEdit))
      dispatch(resetInitialState())
    }
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete-role-success'))
      handleGetListRoles()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteRole()
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t(messageErrorDelete))
      dispatch(resetInitialState())
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
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
          <Grid item md={5} xs={12}>
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ width: '200px' }}>
                  <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
                </Box>
                <GridCreate
                  onClick={() =>
                    setOpenCreateEdit({
                      open: true,
                      id: ''
                    })
                  }
                />
              </Box>
              <CustomDataGrid
                rows={roles.data}
                columns={columns}
                pageSizeOptions={[5]}
                // checkboxSelection
                autoHeight
                hideFooter
                sortingOrder={['desc', 'asc']}
                sortingMode='server'
                onSortModelChange={handleSort}
                getRowId={row => row._id}
                disableRowSelectionOnClick
                // slots={{
                //   pagination: PaginationComponent
                // }}
                disableColumnFilter
                disableColumnMenu
              />
            </Card>
          </Grid>
          <Grid item md={7} xs={12}>
            List permissions:
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
