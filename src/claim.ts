import { Address, ipfs, json, JSONValue } from "@graphprotocol/graph-ts";

import { Transfer, Claim as ClaimContract } from "../generated/Claim/Claim";
import { Attribution, Claim, Source, Tag } from "../generated/schema";
import { slugify } from "./utils/slugify";

export function handleTransfer(event: Transfer): void {
  if (
    Address.fromString("0x0000000000000000000000000000000000000000").equals(
      event.params.from
    )
  ) {
    const claimContract = ClaimContract.bind(event.address);
    const tokenURI = claimContract.tokenURI(event.params.tokenId);
    const tokenURIHash = tokenURI.replace("ipfs://", "");
    const tokenId = event.params.tokenId.toString();
    const metadata = ipfs.cat(tokenURIHash);
    const claim = new Claim(tokenId);

    claim.owner = event.params.to;

    if (metadata) {
      const metadataObj = json.fromBytes(metadata).toObject();

      const name = metadataObj.get("name");
      if (name) {
        claim.title = name.toString();
        claim.slug = tokenId + "-" + slugify(name.toString());
      }

      const description = metadataObj.get("description");
      if (description) {
        claim.summary = description.toString();
      }

      const properties = metadataObj.get("properties");

      if (properties) {
        const propertiesObj = properties.toObject();

        const tags = propertiesObj.get("tags");
        if (tags) {
          claim.tags = tags.toArray().map<string>((tag: JSONValue) => {
            const label = tag.toObject().get("label");

            if (label) {
              const labelStr = label.toString();
              const labelId = slugify(labelStr);
              const tag = Tag.load(labelId);

              if (tag) {
                return labelId;
              } else {
                const newTag = new Tag(labelId);
                newTag.label = labelStr;
                newTag.save();
                return labelId;
              }
            } else {
              return "";
            }
          });
        }

        const sources = propertiesObj.get("sources");
        if (sources) {
          claim.sources = sources.toArray().map<string>((source: JSONValue) => {
            const sourceObj = source.toObject();
            const url = sourceObj.get("url");
            const origin = sourceObj.get("origin");

            if (url) {
              const urlStr = url.toString();
              const source = Source.load(urlStr);

              if (source) {
                return urlStr;
              } else {
                const newSource = new Source(urlStr);
                if (origin) {
                  newSource.origin = origin.toString();
                }
                newSource.save();
                return urlStr;
              }
            } else {
              return "";
            }
          });
        }

        const attributions = propertiesObj.get("attributions");
        if (attributions) {
          claim.attributions = attributions
            .toArray()
            .map<string>((attribution: JSONValue) => {
              const attributionObj = attribution.toObject();
              const identifier = attributionObj.get("identifier");
              const origin = attributionObj.get("origin");

              if (identifier) {
                const identifierStr = identifier.toString();
                const attribution = Source.load(identifierStr);

                if (attribution) {
                  return identifierStr;
                } else {
                  const newAttribution = new Attribution(identifierStr);
                  if (origin) {
                    newAttribution.origin = origin.toString();
                  }
                  newAttribution.save();
                  return identifierStr;
                }
              } else {
                return "";
              }
            });
        }
      }
    }

    claim.save();
  }
}
