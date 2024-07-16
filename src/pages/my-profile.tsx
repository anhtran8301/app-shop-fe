// ** Next
import { NextPage } from 'next'

// ** views
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <MyProfilePage />
}

export default Index

Index.getLayout = (page: React.ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>

