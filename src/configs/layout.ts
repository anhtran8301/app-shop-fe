// ** Translate
import { useTranslation } from 'react-i18next'

// ** Config
import { ROUTE_CONFIG } from './route'
import { PERMISSIONS } from './permission'

export type TVertical = {
  title: string
  path?: string
  icon: string
  permission?: string
  childrens?: {
    title: string
    path?: string
    icon: string
    permission?: string
  }[]
}

export const VerticalItems = () => {
  const { t } = useTranslation()

  return [
    {
      title: t('Dashboard'),
      icon: 'material-symbols-light:dashboard-outline',
      path: ROUTE_CONFIG.DASHBOARD,
      permission: PERMISSIONS.DASHBOARD
    },
    {
      title: t('System'),
      icon: 'eos-icons:file-system-outlined',
      childrens: [
        {
          title: t('User'),
          icon: 'iconoir:group',
          path: ROUTE_CONFIG.SYSTEM.USER,
          permission: PERMISSIONS.SYSTEM.USER.VIEW
        },
        {
          title: t('Role'),
          icon: 'icon-park-outline:permissions',
          path: ROUTE_CONFIG.SYSTEM.ROLE,
          permission: PERMISSIONS.SYSTEM.ROLE.VIEW
        }
      ]
    },
    {
      title: t('Manage_product'),
      icon: 'eos-icons:products-outlined',
      childrens: [
        {
          title: t('List_products'),
          icon: 'icon-park-outline:ad-product',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.PRODUCT
        },
        {
          title: t('Product_type'),
          icon: 'material-symbols-light:category-outline',
          path: ROUTE_CONFIG.MANAGE_PRODUCT.MANAGE_TYPE_PRODUCT
        }
      ]
    },
    {
      title: t('Manage_order'),
      icon: 'carbon:order-details',
      childrens: [
        {
          title: t('List_orders'),
          icon: 'lets-icons:order-light',
          path: ROUTE_CONFIG.MANAGE_ORDER.ORDER,
          permission: PERMISSIONS.MANAGE_ORDER.ORDER.VIEW
        },
        {
          title: t('List_reviews'),
          icon: 'carbon:review',
          path: ROUTE_CONFIG.MANAGE_ORDER.REVIEW
        }
      ]
    },
    {
      title: t('Settings'),
      icon: 'ant-design:setting-outlined',
      childrens: [
        {
          title: t('City'),
          icon: 'solar:city-outline',
          path: ROUTE_CONFIG.SETTINGS.CITY
        },
        {
          title: t('Delivery_method'),
          icon: 'carbon:delivery',
          path: ROUTE_CONFIG.SETTINGS.DELIVERY_TYPE
        },
        {
          title: t('Payment_method'),
          icon: 'streamline:payment-10',
          path: ROUTE_CONFIG.SETTINGS.PAYMENT_TYPE
        }
      ]
    }
  ]
}
