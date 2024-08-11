// ** Next
import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permission'

// ** views

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <h1>Order</h1>
}

Index.permission = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]
export default Index
