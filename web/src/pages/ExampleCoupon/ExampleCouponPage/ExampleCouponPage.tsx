import ExampleCouponCell from 'src/components/ExampleCoupon/ExampleCouponCell'

type ExampleCouponPageProps = {
  id: string
}

const ExampleCouponPage = ({ id }: ExampleCouponPageProps) => {
  return <ExampleCouponCell id={id} />
}

export default ExampleCouponPage
