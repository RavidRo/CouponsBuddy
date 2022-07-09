import EditExampleCouponCell from 'src/components/ExampleCoupon/EditExampleCouponCell'

type ExampleCouponPageProps = {
  id: string
}

const EditExampleCouponPage = ({ id }: ExampleCouponPageProps) => {
  return <EditExampleCouponCell id={id} />
}

export default EditExampleCouponPage
