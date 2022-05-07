"use strict"

import SolanaPayProvider from "../solana-pay-provider"

import { carts } from "../../__mock__/cart"

const TotalsServiceMock = {
  getTotal: jest.fn().mockImplementation((c) => c.total),
}

const RegionServiceMock = {
  retrieve: jest.fn().mockImplementation((id) =>
    Promise.resolve({
      currency_code: "usd",
    })
  ),
}

describe("medusa-plugin-solana-pay", () => {
  const solanaPayProviderService = new SolanaPayProvider(
    {
      regionService: RegionServiceMock,
      totalsService: TotalsServiceMock,
    },
    {}
  )

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  describe("Create Payment", () => {
    it("needs tests", () => {
      solanaPayProviderService.createPayment(carts.emptyCart)
    })
  })
})
