import type { FindExampleCoupons } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ExampleCoupons from 'src/components/ExampleCoupon/ExampleCoupons'

export const QUERY = gql`
  query FindExampleCoupons {
    exampleCoupons {
      id
      content
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No exampleCoupons yet. '}
      <Link
        to={routes.newExampleCoupon()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ exampleCoupons }: CellSuccessProps<FindExampleCoupons>) => {
  return <ExampleCoupons exampleCoupons={exampleCoupons} />
}
