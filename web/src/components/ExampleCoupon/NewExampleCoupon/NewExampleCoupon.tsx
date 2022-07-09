import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ExampleCouponForm from 'src/components/ExampleCoupon/ExampleCouponForm'

const CREATE_EXAMPLE_COUPON_MUTATION = gql`
  mutation CreateExampleCouponMutation($input: CreateExampleCouponInput!) {
    createExampleCoupon(input: $input) {
      id
    }
  }
`

const NewExampleCoupon = () => {
  const [createExampleCoupon, { loading, error }] = useMutation(CREATE_EXAMPLE_COUPON_MUTATION, {
    onCompleted: () => {
      toast.success('ExampleCoupon created')
      navigate(routes.exampleCoupons())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input) => {
    createExampleCoupon({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New ExampleCoupon</h2>
      </header>
      <div className="rw-segment-main">
        <ExampleCouponForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewExampleCoupon
