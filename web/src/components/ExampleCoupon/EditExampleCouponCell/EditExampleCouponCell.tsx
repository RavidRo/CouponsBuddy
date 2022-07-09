import type { EditExampleCouponById } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ExampleCouponForm from 'src/components/ExampleCoupon/ExampleCouponForm'

export const QUERY = gql`
  query EditExampleCouponById($id: String!) {
    exampleCoupon: exampleCoupon(id: $id) {
      id
      content
    }
  }
`
const UPDATE_EXAMPLE_COUPON_MUTATION = gql`
  mutation UpdateExampleCouponMutation($id: String!, $input: UpdateExampleCouponInput!) {
    updateExampleCoupon(id: $id, input: $input) {
      id
      content
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ exampleCoupon }: CellSuccessProps<EditExampleCouponById>) => {
  const [updateExampleCoupon, { loading, error }] = useMutation(UPDATE_EXAMPLE_COUPON_MUTATION, {
    onCompleted: () => {
      toast.success('ExampleCoupon updated')
      navigate(routes.exampleCoupons())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    updateExampleCoupon({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit ExampleCoupon {exampleCoupon.id}</h2>
      </header>
      <div className="rw-segment-main">
        <ExampleCouponForm exampleCoupon={exampleCoupon} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
