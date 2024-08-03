import { IconButton, Tooltip } from '@mui/material'
import IconifyIcon from '../Icon'
import { useTranslation } from 'react-i18next'

interface IGridEdit {
  onClick: () => void
  disabled?: boolean
}

const GridEdit = (props: IGridEdit) => {
  const { onClick, disabled } = props

  const { t } = useTranslation()

  return (
    <Tooltip title={t('Edit')}>
      <IconButton onClick={onClick} disabled={disabled}>
        <IconifyIcon icon='tabler:edit' />
      </IconButton>
    </Tooltip>
  )
}

export default GridEdit
