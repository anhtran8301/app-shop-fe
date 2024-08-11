// ** Next
import { NextPage } from 'next'

// ** Configs
import { PERMISSIONS } from 'src/configs/permission'

// ** views

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <h1>Dashboard</h1>
}

Index.permission = [PERMISSIONS.DASHBOARD]
export default Index
