import humanize from 'humanize-string'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DELETE_EXAMPLE_COUPON_MUTATION = gql`
  mutation DeleteExampleCouponMutation($id: String!) {
    deleteExampleCoupon(id: $id) {
      id
    }
  }
`

const formatEnum = (values: string | string[] | null | undefined) => {
  if (values) {
    if (Array.isArray(values)) {
      const humanizedValues = values.map((value) => humanize(value))
      return humanizedValues.join(', ')
    } else {
      return humanize(values as string)
    }
  }
}

const jsonDisplay = (obj) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  )
}

const timeTag = (datetime) => {
  return (
    datetime && (
      <time dateTime={datetime} title={datetime}>
        {new Date(datetime).toUTCString()}
      </time>
    )
  )
}

const checkboxInputTag = (checked) => {
  return <input type="checkbox" checked={checked} disabled />
}

const ExampleCoupon = ({ exampleCoupon }) => {
  const [deleteExampleCoupon] = useMutation(DELETE_EXAMPLE_COUPON_MUTATION, {
    onCompleted: () => {
      toast.success('ExampleCoupon deleted')
      navigate(routes.exampleCoupons())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete exampleCoupon ' + id + '?')) {
      deleteExampleCoupon({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">ExampleCoupon {exampleCoupon.id} Detail</h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{exampleCoupon.id}</td>
            </tr><tr>
              <th>Content</th>
              <td>{exampleCoupon.content}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editExampleCoupon({ id: exampleCoupon.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(exampleCoupon.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default ExampleCoupon
