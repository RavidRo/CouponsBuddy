import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.ExampleCouponCreateArgs>({
  exampleCoupon: {
    one: { data: { content: 'String' } },
    two: { data: { content: 'String' } },
  },
})

export type StandardScenario = typeof standard
