import type { FindExampleCouponById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ExampleCoupon from 'src/components/ExampleCoupon/ExampleCoupon'

export const QUERY = gql`
  query FindExampleCouponById($id: String!) {
    exampleCoupon: exampleCoupon(id: $id) {
      id
      content
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>ExampleCoupon not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ exampleCoupon }: CellSuccessProps<FindExampleCouponById>) => {
  return <ExampleCoupon exampleCoupon={exampleCoupon} />
}
