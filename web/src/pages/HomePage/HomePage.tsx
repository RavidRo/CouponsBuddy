import { MetaTags } from '@redwoodjs/web'

import ExampleCouponsCell from 'src/components/ExampleCouponsCell'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <h1>Welcome</h1>
      <ExampleCouponsCell />
    </>
  )
}

export default HomePage
