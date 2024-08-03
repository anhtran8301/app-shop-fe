// ** Next react
import * as React from 'react'
import { NextPage } from 'next'

//** Mui
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'

//** views
import VerticalLayOut from './VerticalLayOut'
import HorizontalLayout from './HorizontalLayout'
import { useTheme } from '@mui/material'

type TProps = {
  children: React.ReactNode
}

const UserLayout: NextPage<TProps> = ({ children }) => {
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <VerticalLayOut toggleDrawer={toggleDrawer} open={open} />
      <HorizontalLayout toggleDrawer={toggleDrawer} open={open} />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container
          sx={{
            m: 4,
            width: 'calc(100% - 32px)',
            maxWidth: 'calc(100% - 32px) !important',
            overflow: 'auto',
            maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 32px)`,
            height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 32px)`,
            padding: '0 !important',
            borderRadius: '15px'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default UserLayout
