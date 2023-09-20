import { ethers } from 'ethers';
import { CollectionConfig, production, ERC721Symbol, Network } from 'paraspace-configs-v2';
import { pickBy } from 'lodash';

import { convertToChecksumAddress } from './convertToChecksumAddress';

const mainnetErc721Config = pickBy(
  {
    ...production.nft[Network.MAINNET]?.collection,
    ...production.nft[Network.MOONBEAM]?.collection
  },
  (_value, key) => {
    return ![ERC721Symbol.UNISWAP_LP, ERC721Symbol.SF_VLDR].includes(key as ERC721Symbol);
  }
) as Record<ERC721Symbol, CollectionConfig>;
const mainnetContractsMap = {
  ...production.contracts[Network.MAINNET],
  ...production.contracts[Network.MOONBEAM]
};

enum ERC721ImageAddressFormat {
  LOWER_CASE = 'lowerCase',
  CHECKSUM_MATCHED = 'checksumMatched'
}
const erc721ImageAddressFormatConfig: Partial<Record<ERC721Symbol, ERC721ImageAddressFormat>> = {
  [ERC721Symbol.AZUKI]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.PPG]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.SEWER]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.BEANZ]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.ELEM]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.MBEAN]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.BLOCKS]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.EXP]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.VSL]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.KODA]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.DEGODS]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.HV_MTL]: ERC721ImageAddressFormat.CHECKSUM_MATCHED,
  [ERC721Symbol.MOONBIRD]: ERC721ImageAddressFormat.CHECKSUM_MATCHED
};

const getImgContractNameBySymbol = (symbol: ERC721Symbol) => {
  if (!symbol || !mainnetErc721Config[symbol]) {
    console.warn(`No image for ${symbol}`);
    return null;
  }

  if ([ERC721Symbol.CRYPTOPUNKS, ERC721Symbol.PUNK].includes(symbol)) return 'PUNKS';

  const { contractName } = mainnetErc721Config[symbol];
  return contractName;
};

export const generateImageUrl = (symbol: ERC721Symbol, tokenId: string): string => {
  const contractName = getImgContractNameBySymbol(symbol);
  if (!contractName) return '';

  const address = mainnetContractsMap[contractName];
  const addressFormat = erc721ImageAddressFormatConfig[symbol];
  const formattedAddress =
    addressFormat === ERC721ImageAddressFormat.CHECKSUM_MATCHED
      ? convertToChecksumAddress(address)
      : address.toLowerCase();

  const tokenIdInUse = parseInt(tokenId, 10);
  // using mainnet image
  const rawImageId = `evm_1_${formattedAddress}_${tokenIdInUse}`;
  const imageId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`parallel\n${rawImageId}`));
  return `https://imagedelivery.net/HifslWxquAKrxzKIDXDdDQ/${imageId}`;
};

const ERC721ImageSizes = {
  large: 256,
  small: 64
};

export const getSmallERC721Image = (symbol: ERC721Symbol, tokenId: string) => {
  const imageURL = generateImageUrl(symbol, tokenId);
  return `${imageURL}/w=${ERC721ImageSizes.small}`;
};

export const getLargeERC721Image = (symbol: ERC721Symbol, tokenId: string) => {
  const imageURL = generateImageUrl(symbol, tokenId);
  return `${imageURL}/w=${ERC721ImageSizes.large}`;
};
