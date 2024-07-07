// ** Next
import { NextPage } from 'next'

// ** views
import BlankLayout from 'src/views/layouts/BlankLayout'
import RegisterPage from 'src/views/pages/register'

type TProps = {}

const Register: NextPage<TProps> = () => {
  return <RegisterPage />
}

export default Register

Register.getLayout = (page: React.ReactNode) => <BlankLayout>{page}</BlankLayout>

