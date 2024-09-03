// ** React
import { useEffect, useState } from 'react'

// ** Mui
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'

// ** Form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Translate
import { useTranslation } from 'react-i18next'

// ** Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createRoleAsync, updateRoleAsync } from 'src/stores/role/actions'

// ** Components
import CustomModal from 'src/components/custom-modal'
import IconifyIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'

// ** Services
import { getDetailsRole } from 'src/services/role'

interface ICreateEditRole {
  open: boolean
  onClose: () => void
  idRole?: string
}

const CreateEditRole = (props: ICreateEditRole) => {
  // ** State
  const [loading, setLoading] = useState(false)

  // ** Props
  const { open, onClose, idRole } = props

  // ** Translate
  const { t } = useTranslation()

  // ** Theme
  const theme = useTheme()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    name: yup.string().required(t('Required_field'))
  })

  const defaultValues = {
    name: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: { name: string }) => {
    if (!Object.keys(errors)?.length) {
      if (idRole) {
        dispatch(updateRoleAsync({ name: data?.name, id: idRole }))
      } else {
        dispatch(createRoleAsync({ name: data?.name }))
      }
    }
  }

  // ** fetch
  const fetchDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailsRole(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data?.name
          })
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!open) {
      reset({
        name: ''
      })
    } else if (idRole) {
      fetchDetailsRole(idRole)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idRole])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{
            padding: '20px',
            borderRadius: '15px',
            backgroundColor: theme.palette.customColors.bodyBg
          }}
          minWidth={{ md: '400px', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {!idRole ? t('Tạo nhóm vai trò') : t('Chỉnh sử nhóm vai trò')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: '-6px', right: '-10px' }} onClick={onClose}>
              <IconifyIcon icon='material-symbols-light:close' fontSize={'30px'} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <Box
              sx={{
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                padding: '30px 20px',
                borderRadius: '15px'
              }}
            >
              <Controller
                control={control}
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    autoFocus
                    label={t('Name_role')}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={t('Enter_name')}
                    error={Boolean(errors?.name)}
                    helperText={errors?.name?.message}
                  />
                )}
                name='name'
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idRole ? t('Create') : t('Edit')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditRole
