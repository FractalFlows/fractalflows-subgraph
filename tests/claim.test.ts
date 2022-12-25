import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Approval } from "../generated/Claim/Claim"
import { handleTransfer } from "../src/claim"
import { createTransferEvent } from "./claim-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  afterAll(() => {
    clearStore()
  })

  test("Transfer", () => {
    const from = Address.fromString('0x0000000000000000000000000000000000000000')
    const to = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    const tokenId = BigInt.fromI32(234343434)
    const newTransferEvent = createTransferEvent(from, to, tokenId)

    handleTransfer(newTransferEvent)

    assert.entityCount("Claim", 1)
    // assert.fieldEquals(
    //   "Claim",
    //   tokenId.toString(),
    //   "owner",
    //   to.toString()
    // )
  })
})
