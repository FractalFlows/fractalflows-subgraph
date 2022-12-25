import { Address, Bytes, log, ipfs } from "@graphprotocol/graph-ts"

import {
  Transfer,
  Claim as ClaimContract,
} from "../generated/Claim/Claim"
import { Claim } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  // if (Address.fromString('0x0000000000000000000000000000000000000000').equals(event.params.from)) {
  //   const claimContract = ClaimContract.bind(event.address)
  //   const tokenURI = claimContract.tokenURI(event.params.tokenId);
  //   // const tokenURI = "ipfs://bafyreidhh74echr3d6zn2sdqjaess3ooxmkz6c7dqvv4q6qvqj7wtkqv7y/metadata.json";
  //   const tokenURIHash = tokenURI.replace('ipfs://', '');

  //   log.info("tokenURI: {}", [tokenURI])

  //   const data = ipfs.cat(tokenURIHash)

    // log.info("data: {}", [data?.toString()])


    const tokenId = Bytes.fromByteArray(Bytes.fromBigInt(event.params.tokenId));
    const claim = new Claim(tokenId);

    claim.owner = event.params.to;
    claim.save();
  // }
}
