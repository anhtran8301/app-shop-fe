// ** Next
import { NextPage } from 'next'

// ** views
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import ChangePasswordPage from 'src/views/pages/change-password'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ChangePasswordPage />
}

export default Index

Index.getLayout = (page: React.ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
