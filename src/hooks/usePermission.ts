import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from './useAuth'
import { useEffect, useState } from 'react'

type TActions = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW'

export const usePermission = (key: string, actions: TActions[]) => {
  const { user } = useAuth()

  const defaultValue = {
    CREATE: false,
    UPDATE: false,
    DELETE: false,
    VIEW: false
  }

  const getObjectValue = (obj: any, key: string) => {
    const keys = key.split('.')
    let result = obj
    if (keys && !!key.length) {
      for (const k of keys) {
        if (k in result) {
          result = result[k]
        } else {
          return undefined
        }
      }
    }

    return result
  }

  const userPermissions = user?.role?.permissions

  // ** State
  const [permission, setPermission] = useState(defaultValue)

  useEffect(() => {
    const mapPermission = getObjectValue(PERMISSIONS, key)
    actions.forEach(mode => {
      if (userPermissions?.includes(PERMISSIONS.ADMIN)) {
        defaultValue[mode] = true
      } else if (userPermissions?.includes(mapPermission[mode])) {
        defaultValue[mode] = true
      } else {
        defaultValue[mode] = false
      }
    })

    setPermission(defaultValue)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role])

  return permission
}
