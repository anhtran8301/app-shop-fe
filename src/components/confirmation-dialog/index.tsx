// ** React
import { useEffect, useState } from 'react'

// ** Mui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Typography,
  useTheme
} from '@mui/material'

// ** Translate
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../Icon'

interface IConfirmationDialog {
  handleClose: () => void
  open: boolean
  title: string
  description: string
  handleConfirm: () => void
  handleCancel: () => void
}

const CustomStyleContent = styled(DialogContentText)(() => ({
  padding: '10px 20px'
}))

const StyledDialog = styled(Dialog)(() => ({
  '.MuiPaper-root.MuiPaper-elevation': {
    width: '400px'
  }
}))

const ConfirmationDialog = (props: IConfirmationDialog) => {
  // ** Props
  const { open, handleClose, title, description, handleConfirm, handleCancel } = props

  // ** Translate
  const { t } = useTranslation()

  // ** Theme
  const theme = useTheme()

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <IconifyIcon icon='ep:warning' fontSize={80} color={theme.palette.warning.main} />
      </Box>
      <DialogTitle sx={{ textAlign: 'center' }} id='alert-dialog-title'>
        <Typography variant='h4' sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>

      <CustomStyleContent>
        <DialogContentText sx={{ textAlign: 'center', marginBottom: '20px' }} id='alert-dialog-description'>
          {description}
        </DialogContentText>
      </CustomStyleContent>

      <DialogActions>
        <Button variant='contained' onClick={handleConfirm}>
          {t('confirm')}
        </Button>
        <Button color='error' variant='outlined' onClick={handleCancel} autoFocus>
          {t('cancel')}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

export default ConfirmationDialog
