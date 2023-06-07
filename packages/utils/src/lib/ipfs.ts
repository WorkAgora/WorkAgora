import { NFTStorage, Blob } from 'nft.storage';
import { ethers } from 'ethers';

export async function signMessage(
  messageDatas: { type: string; value: string }[]
): Promise<string> {
  const privateKey = process.env['WALLET_PRIVATE_KEY'];

  if (!privateKey) {
    throw new Error('ENV: WALLET_PRIVATE_KEY is not defined');
  }

  const wallet = new ethers.Wallet(privateKey);

  const types = messageDatas.map((message) => message.type);
  const values = messageDatas.map((message) => message.value);

  const messageHash = ethers.utils.solidityKeccak256(types, values);
  const signedMessage = await wallet.signMessage(ethers.utils.arrayify(messageHash));

  return signedMessage;
}

export function createSignableMessage(object: any): string {
  const message = JSON.stringify(object);
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message));
}

export async function mySignMessage(message: string): Promise<string> {
  const privateKey = process.env['WALLET_PRIVATE_KEY'];

  if (!privateKey) {
    throw new Error('ENV: PRIVATE_KEY is not defined');
  }

  const wallet = new ethers.Wallet(privateKey);
  return await wallet.signMessage(ethers.utils.arrayify(message));
}

export function verifySignature(message: string, signature: string): string {
  return ethers.utils.verifyMessage(ethers.utils.arrayify(message), signature);
}

export interface SignedMessage {
  message: string;
  messageSigned: string;
}

// Encode a JSON object for IPFS
export async function encodeJSONForIPFS(json: object): Promise<SignedMessage> {
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

  return {
    message: cid.toString(),
    messageSigned: await signMessage([{ type: 'cid_signed', value: cid.toString() }])
  };
}

export async function storeJSONToIPFS(json: object): Promise<SignedMessage> {
  const envVariable = process.env['NFT_STORAGE_API_KEY'];
  if (!envVariable) {
    throw new Error('ENV: NFT_STORAGE_API_KEY is not defined');
  }

  const client = new NFTStorage({ token: envVariable });

  let blob: Blob;
  try {
    blob = new Blob([Buffer.from(JSON.stringify(json), 'utf8')], { type: 'application/json' });
  } catch (e) {
    throw new Error(`Error creating the blob: ${e}`);
  }

  // Store the Blob in IPFS
  const cid = await client.storeBlob(blob).catch((e) => {
    throw new Error(`Error storing the blob in IPFS: ${e.message}`);
  });

  return {
    message: cid.toString(),
    messageSigned: await signMessage([{ type: 'cid_signed', value: cid }])
  };
}
