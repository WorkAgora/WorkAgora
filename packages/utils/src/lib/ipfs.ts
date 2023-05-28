import { NFTStorage, Blob } from 'nft.storage';

// Encode a JSON object for IPFS
export async function encodeJSONForIPFS(json: object): Promise<string> {
  let blob: Blob;
  try {
    blob = new Blob([Buffer.from(JSON.stringify(json), 'utf8')]);
  } catch (e) {
    throw new Error(`Error creating the blob: ${e}`);
  }

  // Convert the signed message into a Blob and store it
  const { cid } = await NFTStorage.encodeBlob(blob).catch((e) => {
    throw new Error(`Error encoding the blob: ${e.message}`);
  });

  return cid.toString();
}
