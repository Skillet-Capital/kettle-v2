import { MerkleTree } from 'merkletreejs';
import { BigNumber } from '@ethersproject/bignumber';
import { keccak256 } from 'ethers';

export function hashToken(tokenId: string | number | bigint) {
  return keccak256(
    Buffer.from(
      BigNumber.from(tokenId).toHexString().slice(2).padStart(64, '0'),
      'hex',
    ),
  );
}

export function generateRoot(tokens: (string | number | bigint)[]) {
  const tree = new MerkleTree(
    tokens.map(hashToken),
    keccak256,
    {
      sort: true,
    },
  );

  return tree.getHexRoot();
}

export function generateProof(tokens: (string | number | bigint)[], token: string | number | bigint) {
  if (!token) throw new Error('Token is required to generate proof');
  const tree = new MerkleTree(
    tokens.map(hashToken),
    keccak256,
    {
      sort: true,
    },
  );

  const tokenHash = hashToken(token);
  return tree.getHexProof(tokenHash);
}

module.exports = {
  hashToken,
  generateRoot,
  generateProof,
};
