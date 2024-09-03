// ** React
import { useEffect, useState } from 'react'

// ** Mui
import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Switch,
  Typography,
  useTheme
} from '@mui/material'

// ** Form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Translate
import { useTranslation } from 'react-i18next'

// ** Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createUserAsync, updateUserAsync } from 'src/stores/user/actions'

// ** Services
import { getDetailsUser } from 'src/services/user'
import { getAllRoles } from 'src/services/role'

// ** Config
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// ** Utils
import { convertBase64, separationFullName, toFullName } from 'src/utils'

// ** Components
import CustomModal from 'src/components/custom-modal'
import IconifyIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import CustomSelect from 'src/components/custom-select'

interface ICreateEditUser {
  open: boolean
  onClose: () => void
  id?: string
}

type TDefaultValue = {
  fullName: string
  email: string
  password?: string
  role: string
  phoneNumber: string
  address?: string
  status?: number
  city?: string
}

const CreateEditUser = (props: ICreateEditUser) => {
  // ** State
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [showPassword, setShowPassword] = useState(false)

  // ** Props
  const { open, onClose, id } = props

  // ** Translate
  const { t, i18n } = useTranslation()

  // ** Theme
  const theme = useTheme()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    fullName: yup.string().required(t('Required_field')),
    email: yup.string().required(t('Required_field')).matches(EMAIL_REG, t('Rules_email')),
    password: id
      ? yup.string().nonNullable()
      : yup.string().required(t('Required_field')).matches(PASSWORD_REG, t('Rules_password')),
    role: yup.string().required(t('Required_field')),
    phoneNumber: yup.string().required(t('Required_field')).min(8, 'The phone number min is 8 numbers'),
    address: yup.string().nonNullable(),
    city: yup.string().nonNullable(),
    status: yup.number().nonNullable()
  })

  const defaultValues: TDefaultValue = {
    fullName: '',
    email: '',
    password: '',
    role: '',
    phoneNumber: '',
    address: '',
    status: 1,
    city: ''
  }

  // ** Handle
  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
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

  const onSubmit = (data: TDefaultValue) => {
    if (!Object.keys(errors)?.length) {
      const { firstName, lastName, middleName } = separationFullName(data.fullName, i18n.language)

      if (id) {
        dispatch(
          updateUserAsync({
            id,
            firstName,
            middleName,
            lastName,
            phoneNumber: data.phoneNumber,
            role: data?.role,
            email: data.email,
            address: data?.address,
            city: data?.city,
            avatar: avatar
          })
        )
      } else {
        dispatch(
          createUserAsync({
            firstName,
            middleName,
            lastName,
            password: data.password || "",
            phoneNumber: data.phoneNumber,
            role: data?.role,
            email: data.email,
            address: data?.address,
            city: data?.city,
            avatar: avatar
          })
        )
      }
    }
  }

  // ** fetch
  const fetchDetailsUser = async (id: string) => {
    setLoading(true)
    await getDetailsUser(id)
      .then(res => {
        const data = res.data
        if (data) {
          console.log({data})
          reset({
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
            password: data.password,
            phoneNumber: data.phoneNumber,
            role: data?.role._id,
            email: data.email,
            address: data?.address,
            city: data?.city,
            status: data?.status
          })
          setAvatar(data.avatar)
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const fetchAllRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.roles
        if (data) {
          setOptionRoles(
            data?.map((item: { name: string; _id: string }) => ({
              label: item.name,
              value: item._id
            }))
          )
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
        ...defaultValues
      })
    } else if (id) {
      fetchDetailsUser(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id])

  useEffect(() => {
    fetchAllRoles()
  }, [])

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
          minWidth={{ md: '800px', xs: '80vw' }}
          maxWidth={{ md: '80vw', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {!id ? t('Create_user') : t('Edit_user')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: '-6px', right: '-10px' }} onClick={onClose}>
              <IconifyIcon icon='material-symbols-light:close' fontSize={'30px'} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}>
              <Grid container spacing={5}>
                <Grid container item md={6} xs={12}>
                  <Box sx={{ height: '100%', width: '100%' }}>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative'
                            }}
                          >
                            {avatar && (
                              <IconButton
                                sx={{
                                  position: 'absolute',
                                  bottom: -4,
                                  right: -6,
                                  zIndex: 2,
                                  color: theme.palette.error.main
                                }}
                                edge='start'
                                color='inherit'
                                aria-label='open drawer'
                                onClick={() => setAvatar('')}
                              >
                                <IconifyIcon icon='material-symbols-light:delete-outline' />
                              </IconButton>
                            )}
                            {avatar ? (
                              <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                                <IconifyIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            ) : (
                              <Avatar sx={{ width: 100, height: 100 }}>
                                <IconifyIcon icon='ph:user-thin' fontSize={70} />
                              </Avatar>
                            )}
                          </Box>
                          <WrapperFileUpload
                            uploadFunc={handleUploadAvatar}
                            objectAcceptFile={{
                              'image/jpeg': ['.jpg', '.jpeg'],
                              'image/png': ['.png']
                            }}
                          >
                            <Button
                              variant='outlined'
                              sx={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <IconifyIcon icon='ph:camera-thin'></IconifyIcon>
                              {avatar ? t('Change_avatar') : t('Upload_avatar')}
                            </Button>
                          </WrapperFileUpload>
                        </Box>
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          rules={{
                            required: true
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              autoFocus
                              fullWidth
                              label={t('Email')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_your_email')}
                              error={Boolean(errors?.email)}
                              helperText={errors?.email?.message}
                            />
                          )}
                          name='email'
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          rules={{
                            required: true
                          }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            console.log({value})

                            return (
                              (
                            
                          
                                <Box>
                                  <InputLabel
                                    sx={{
                                      fontSize: '13px',
                                      marginBottom: '4px',
                                      display: 'block',
                                      color: errors?.role
                                        ? theme.palette.error.main
                                        : `rgba(${theme.palette.customColors.main}, 0.42)`
                                    }}
                                  >
                                    {t('Role')}
                                  </InputLabel>
                                  <CustomSelect
                                    fullWidth
                                    onChange={onChange}
                                    options={optionRoles}
                                    error={Boolean(errors?.role)}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder={t('Enter_your_role')}
                                  />
                                  {errors?.role && (
                                    <FormHelperText
                                      sx={{
                                        color: errors?.role
                                          ? theme.palette.error.main
                                          : `rgba(${theme.palette.customColors.main}, 0.42)`
                                      }}
                                    >
                                      {errors?.role?.message}
                                    </FormHelperText>
                                  )}
                                </Box>
                              )
                            )
                          }}
                          name='role'
                        />
                      </Grid>
                      {!id && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            rules={{
                              required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                              <CustomTextField
                                required
                                fullWidth
                                label={t('Password')}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder={t('Enter_password')}
                                error={Boolean(errors?.password)}
                                helperText={errors?.password?.message}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position='end'>
                                      <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                          <IconifyIcon icon='material-symbols:visibility-outline' />
                                        ) : (
                                          <IconifyIcon icon='ic:outline-visibility-off' />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            )}
                            name='password'
                          />
                        </Grid>
                      )}
                      {id && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      color='default'
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={e => {
                                        onChange(e.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? t('Active') : t('Block')}
                                />
                              )
                            }}
                            name='status'
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>

                <Grid container item md={6} xs={12}>
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              fullWidth
                              label={t('Full_name')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_your_full_name')}
                              error={Boolean(errors?.fullName)}
                              helperText={errors?.fullName?.message}
                            />
                          )}
                          name='fullName'
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              fullWidth
                              label={t('Address')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_your_address')}
                            />
                          )}
                          name='address'
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.city
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {t('City')}
                              </InputLabel>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                options={[]}
                                error={Boolean(errors?.city)}
                                onBlur={onBlur}
                                value={value}
                                placeholder={t('Enter_your_city')}
                              />
                              {errors?.city?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.city
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  {errors?.city?.message}
                                </FormHelperText>
                              )}
                            </Box>
                          )}
                          name='city'
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Phone_number')}
                              onChange={e => {
                                const numValue = e.target.value.replace(/\D/g, '')
                                onChange(numValue)
                              }}
                              inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                minLength: 8
                              }}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_your_phone')}
                              error={Boolean(errors?.phoneNumber)}
                              helperText={errors?.phoneNumber?.message}
                            />
                          )}
                          name='phoneNumber'
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                  {!id ? t('Create') : t('Edit')}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditUser
