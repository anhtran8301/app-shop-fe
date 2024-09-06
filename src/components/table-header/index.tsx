// ** MUI Imports
import { Box, Button, IconButton, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

// ** Translate
import { useTranslation } from 'react-i18next'

// ** Components
import IconifyIcon from '../Icon'

const StyledTableHeader = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  border: `2px solid ${theme.palette.primary.main}`,
  padding: '4px 10px',
  width: '100%',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

type TProps = {
  numRow: number
  onClear: () => void
  actions: { label: string; value: string; disabled?: boolean }[]
  handleAction: (type: string) => void
}

const TableHeader = (props: TProps) => {
  const { numRow, onClear, actions, handleAction } = props

  const { t } = useTranslation()

  // ** Hook
  const theme = useTheme()

  return (
    <StyledTableHeader>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Typography>{t('Selected')}</Typography>
        <Typography
          sx={{
            backgroundColor: theme.palette.primary.main,
            height: '20px',
            width: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            color: theme.palette.customColors.lightPaperBg,
            fontWeight: 600,
            fontSize: '12px !important'
          }}
        >
          <span>{numRow}</span>
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {actions?.map(action => {
          return (
            <Button
              disabled={action.disabled}
              key={action.label}
              variant='contained'
              onClick={() => handleAction(action.value)}
            >
              {action.label}
            </Button>
          )
        })}
        <IconButton onClick={onClear}>
          <IconifyIcon icon='material-symbols-light:close' fontSize={'20px'} />
        </IconButton>
      </Box>
    </StyledTableHeader>
  )
}

export default TableHeader
