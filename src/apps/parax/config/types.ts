import { ERC721Symbol, NFTEnumerableType, Network, development } from 'paraspace-configs-v2';

export type ContractName = keyof (typeof development.contracts)[Network];

export type ContractMap = Record<ContractName, string>;

export type CollectionConfig = {
  symbol: ERC721Symbol;
  collectionName: string;
  nftEnumerableType: NFTEnumerableType;
  contractName: ContractName;
  wrappedContractName?: ContractName;
  openseaSlug: string;
  contractAddress?: string;
  address: string;
};
