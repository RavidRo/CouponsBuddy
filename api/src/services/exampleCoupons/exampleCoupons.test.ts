import {
  exampleCoupons,
  exampleCoupon,
  createExampleCoupon,
  updateExampleCoupon,
  deleteExampleCoupon,
} from './exampleCoupons'
import type { StandardScenario } from './exampleCoupons.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('exampleCoupons', () => {
  scenario('returns all exampleCoupons', async (scenario: StandardScenario) => {
    const result = await exampleCoupons()

    expect(result.length).toEqual(Object.keys(scenario.exampleCoupon).length)
  })

  scenario(
    'returns a single exampleCoupon',
    async (scenario: StandardScenario) => {
      const result = await exampleCoupon({ id: scenario.exampleCoupon.one.id })

      expect(result).toEqual(scenario.exampleCoupon.one)
    }
  )

  scenario('creates a exampleCoupon', async () => {
    const result = await createExampleCoupon({
      input: { content: 'String' },
    })

    expect(result.content).toEqual('String')
  })

  scenario('updates a exampleCoupon', async (scenario: StandardScenario) => {
    const original = await exampleCoupon({ id: scenario.exampleCoupon.one.id })
    const result = await updateExampleCoupon({
      id: original.id,
      input: { content: 'String2' },
    })

    expect(result.content).toEqual('String2')
  })

  scenario('deletes a exampleCoupon', async (scenario: StandardScenario) => {
    const original = await deleteExampleCoupon({
      id: scenario.exampleCoupon.one.id,
    })
    const result = await exampleCoupon({ id: original.id })

    expect(result).toEqual(null)
  })
})
