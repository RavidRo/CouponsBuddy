export const schema = gql`
  type ExampleCoupon {
    id: String!
    content: String!
  }

  type Query {
    exampleCoupons: [ExampleCoupon!]! @requireAuth
    exampleCoupon(id: String!): ExampleCoupon @requireAuth
  }

  input CreateExampleCouponInput {
    content: String!
  }

  input UpdateExampleCouponInput {
    content: String
  }

  type Mutation {
    createExampleCoupon(input: CreateExampleCouponInput!): ExampleCoupon!
      @requireAuth
    updateExampleCoupon(
      id: String!
      input: UpdateExampleCouponInput!
    ): ExampleCoupon! @requireAuth
    deleteExampleCoupon(id: String!): ExampleCoupon! @requireAuth
  }
`
