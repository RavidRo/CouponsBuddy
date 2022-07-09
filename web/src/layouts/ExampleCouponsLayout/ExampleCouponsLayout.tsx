import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

type ExampleCouponLayoutProps = {
  children: React.ReactNode
}

const ExampleCouponsLayout = ({ children }: ExampleCouponLayoutProps) => {
  return (
    <div className="rw-scaffold">
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link
            to={routes.exampleCoupons()}
            className="rw-link"
          >
            ExampleCoupons
          </Link>
        </h1>
        <Link
          to={routes.newExampleCoupon()}
          className="rw-button rw-button-green"
        >
          <div className="rw-button-icon">+</div> New ExampleCoupon
        </Link>
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default ExampleCouponsLayout
