import { IconButton, Tooltip } from '@mui/material'
import IconifyIcon from '../Icon'
import { useTranslation } from 'react-i18next'

interface IGridDelete {
  onClick: () => void
  disabled?: boolean
}

const GridDelete = (props: IGridDelete) => {
  const { onClick, disabled } = props

  const { t } = useTranslation()

  return (
    <Tooltip title={t('Delete')}>
      <IconButton onClick={onClick} disabled={disabled}>
        <IconifyIcon icon='mdi:delete-outline' />
      </IconButton>
    </Tooltip>
  )
}

export default GridDelete
