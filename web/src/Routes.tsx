// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ExampleCouponsLayout from 'src/layouts/ExampleCouponsLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={ExampleCouponsLayout}>
        <Route path="/example-coupons/new" page={ExampleCouponNewExampleCouponPage} name="newExampleCoupon" />
        <Route path="/example-coupons/{id}/edit" page={ExampleCouponEditExampleCouponPage} name="editExampleCoupon" />
        <Route path="/example-coupons/{id}" page={ExampleCouponExampleCouponPage} name="exampleCoupon" />
        <Route path="/example-coupons" page={ExampleCouponExampleCouponsPage} name="exampleCoupons" />
      </Set>
      <Route path="/" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
