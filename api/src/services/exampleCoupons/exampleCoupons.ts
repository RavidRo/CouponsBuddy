import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const exampleCoupons: QueryResolvers['exampleCoupons'] = () => {
  return db.exampleCoupon.findMany()
}

export const exampleCoupon: QueryResolvers['exampleCoupon'] = ({ id }) => {
  return db.exampleCoupon.findUnique({
    where: { id },
  })
}

export const createExampleCoupon: MutationResolvers['createExampleCoupon'] = ({
  input,
}) => {
  return db.exampleCoupon.create({
    data: input,
  })
}

export const updateExampleCoupon: MutationResolvers['updateExampleCoupon'] = ({
  id,
  input,
}) => {
  return db.exampleCoupon.update({
    data: input,
    where: { id },
  })
}

export const deleteExampleCoupon: MutationResolvers['deleteExampleCoupon'] = ({
  id,
}) => {
  return db.exampleCoupon.delete({
    where: { id },
  })
}
