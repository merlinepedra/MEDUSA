import { Cluster, clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"
import { encodeURL, createQR } from "@solana/pay"
import BigNumber from "bignumber.js"

import { PaymentService } from "medusa-interfaces"

class SolanaPayProvider extends PaymentService {
  constructor() {
    super()

    // TODO: read nwtwork config from the env
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed")
  }

  createPayment(cart) {
    // TODO: read merchant's wallet address from the env

    const recipient = new PublicKey("MERCHANT_WALLET")

    // TODO: calcualte amount
    const amount = new BigNumber(cart.payment.amount)

    // create unique refference for this session which will alter be used to find transaction on the chain
    const reference = new Keypair().publicKey

    const label = "Medusa store"
    const message = "msg TODO add reference"
    const memo = "JC#4098"
  }

  // retrievePayment(cart) {
  //   throw Error("getPayment must be overridden by the child class")
  // }
  //
  // updatePayment(cart) {
  //   throw Error("updatePayment must be overridden by the child class")
  // }
  //
  // getStatus() {
  //   throw Error("getStatus must be overridden by the child class")
  // }
  //
  // authorizePayment() {
  //   throw Error("authorizePayment must be overridden by the child class")
  // }
  //
  // capturePayment() {
  //   throw Error("capturePayment must be overridden by the child class")
  // }
  //
  // refundPayment() {
  //   throw Error("refundPayment must be overridden by the child class")
  // }
  //
  // deletePayment() {
  //   throw Error("deletePayment must be overridden by the child class")
  // }
}

export default SolanaPayProvider
