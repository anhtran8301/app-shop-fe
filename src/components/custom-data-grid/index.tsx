import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { styled } from '@mui/material'

const StyleCustomDataGrid = styled(DataGrid)<DataGridProps>(({ theme }) => ({
  ".MuiDataGrid-withBorderColor": {
    outline: "none !important"
  },
  ".MuiDataGrid-selectedRowCount": {
    display: "none"
  },
  ".MuiDataGrid-columnHeaderTitle": {
    textTransform: "capitalize",
    color: theme.palette.primary.main
  }
}))

const CustomDataGrid = React.forwardRef((props: DataGridProps, ref: React.Ref<any>) => {
  return (
    <Box sx={{ height: "100%", width: '100%', overflow: 'auto' }}>
      <StyleCustomDataGrid {...props} />
    </Box>
  )
})

export default CustomDataGrid
